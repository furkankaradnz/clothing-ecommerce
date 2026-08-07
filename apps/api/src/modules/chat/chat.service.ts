import { callGemini, GeminiMessage } from '../../common/gemini/geminiClient';
import { productService } from '../products/product.service';
import { categoryRepository } from '../categories/category.repository';
import { productQuerySchema } from '../products/product.schema';
import { ChatInput } from './chat.schema';

// Gemini'nin döndürmesini istediğimiz yapı
interface AiDecision {
  reply: string; // kullanıcıya gösterilecek dostça mesaj
  filters: Record<string, unknown> | null; // ürün araması yapılacaksa filtreler
}

// Sistem talimatını kategorilerle birlikte kurar
function buildSystemPrompt(categorySlugs: { name: string; slug: string }[]) {
  const categoryList = categorySlugs
    .map((c) => `- "${c.name}" (slug: ${c.slug})`)
    .join('\n');

  return `Sen bir giyim e-ticaret sitesinin yardımcı asistanısın. Kullanıcılara ürün önerir ve aramalarına yardım edersin. Her zaman Türkçe ve samimi bir dille cevap ver.

Mevcut kategoriler:
${categoryList}

Kullanıcının mesajına göre, eğer bir ÜRÜN ARAMASI/ÖNERİSİ istiyorsa, uygun filtreleri çıkar. Yanıtını SADECE şu JSON formatında ver (başka hiçbir şey yazma):

{
  "reply": "Kullanıcıya gösterilecek kısa, samimi mesaj (Türkçe)",
  "filters": {
    "category": "kategori slug'ı veya boş",
    "search": "aranan kelime veya boş",
    "minPrice": sayı veya yok,
    "maxPrice": sayı veya yok,
    "size": "beden (S/M/L/XL) veya boş",
    "color": "renk veya boş",
    "sort": "newest | price-asc | price-desc | name-asc"
  }
}

Kurallar:
- Kullanıcı ürün aramıyorsa (selamlaşma, genel soru), "filters" alanını null yap ve sadece "reply" ile cevap ver.
- Sadece kullanıcının belirttiği filtreleri ekle. Belirtmediği alanları boş bırak veya ekleme.
- Fiyattan bahsederse minPrice/maxPrice kullan. "ucuz" derse price-asc sırala.
- "reply" mesajında ürünleri SEN listeleme; ürünleri sistem gösterecek. Sadece "İşte sana uygun ürünler:" gibi bir giriş yaz.
- Kategori eşleştirmesi için yukarıdaki slug'ları kullan (örn: tişört isteniyorsa uygun slug).`;
}

export const chatService = {
  async chat(input: ChatInput) {
    // Kategorileri al (prompt'a enjekte etmek için)
    const categories = await categoryRepository.findAll();
    const systemPrompt = buildSystemPrompt(
      categories.map((c) => ({ name: c.name, slug: c.slug }))
    );

    const messages: GeminiMessage[] = input.messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    // Gemini'den JSON kararı al
    const raw = await callGemini({
      systemInstruction: systemPrompt,
      messages,
      jsonMode: true,
    });

    // JSON'u güvenli parse et
    let decision: AiDecision;
    try {
      decision = JSON.parse(raw);
    } catch {
      // Model bazen JSON'u ```json ... ``` içine koyabilir; temizle
      const cleaned = raw.replace(/```json|```/g, '').trim();
      try {
        decision = JSON.parse(cleaned);
      } catch {
        // Parse edilemezse, ham metni mesaj olarak dön
        return { reply: raw, products: [] };
      }
    }

    // Filtre yoksa sadece mesaj dön
    if (!decision.filters) {
      return { reply: decision.reply, products: [] };
    }

    // Filtreleri temizle: boş string'leri at
    const cleanFilters: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(decision.filters)) {
      if (value !== '' && value !== null && value !== undefined) {
        cleanFilters[key] = value;
      }
    }

    // Kendi ürün servisimizle GERÇEK ürünleri çek (model uydurmaz!)
    const query = productQuerySchema.parse({ ...cleanFilters, limit: 6 });
    const result = await productService.list(query);

    return {
      reply: decision.reply,
      products: result.products,
      appliedFilters: cleanFilters,
    };
  },
};
