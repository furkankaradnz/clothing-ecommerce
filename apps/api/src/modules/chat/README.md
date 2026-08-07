# Chat (AI Asistan) Modülü

Google Gemini ile ürün önerisi yapan chatbot. LLM'i "doğal dil → filtre çevirmeni"
olarak kullanır; ürünleri KENDİ veritabanımızdan çeker (model ürün uyduramaz).

## Nasıl çalışır?

1. Kullanıcı doğal dille yazar: "300 TL altında tişört öner"
2. Gemini'ye kategorilerle birlikte sistem talimatı gönderilir, JSON formatında
   `{ reply, filters }` döndürmesi istenir (structured output)
3. Gemini şunu döner: `{ reply: "İşte tişörtler!", filters: { category: "tisort", maxPrice: 300 } }`
4. Backend bu filtrelerle **kendi productService.list()**'ini çağırır → GERÇEK ürünler
5. Kullanıcıya `{ reply, products }` döner

## Neden bu mimari?
LLM'e "ürün öner" deyip listeyi ona yazdırmak TEHLİKELİDİR: model olmayan ürün
uydurur, yanlış fiyat/stok verir. Bu yaklaşımda model sadece niyeti anlar;
gerçek veri her zaman bizim DB'mizden gelir.

## Endpoint

| Metot | Yol         | Açıklama              | Koruma |
| ----- | ----------- | --------------------- | ------ |
| POST  | `/api/chat` | Mesaj gönder, öneri al| -      |

Body: `{ "messages": [{ "role": "user", "text": "..." }] }`
(Sohbet geçmişi; son 10 mesaj bağlam olarak gönderilir.)

## Kurulum: Gemini API anahtarı (ÜCRETSİZ)

1. https://aistudio.google.com/apikey adresine git (Google hesabı yeterli)
2. "Create API key" → anahtarı kopyala
3. `apps/api/.env` içine yapıştır: `GEMINI_API_KEY=AIza...`
4. Backend'i yeniden başlat

Ücretsiz kota: günde ~1500 istek (gemini-2.5-flash). Kredi kartı gerekmez.

## Model churn notu
Model adı `GEMINI_MODEL` env değişkeninde. Google modelleri emekliye ayırıyor
(gemini-2.5-flash 16 Ekim 2026'da kapanacak). Kapanırsa AI Studio'dan güncel
ücretsiz modeli bul (örn: gemini-3.x-flash) ve env'i güncelle — kod değişmez.

## Güvenlik
- API anahtarı SADECE backend'de (.env). Frontend'e asla konmaz.
- .env git'e girmez (.gitignore'da).
