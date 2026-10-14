import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const slugify = (s: string) =>
  s.toLowerCase()
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---- Gerçek kıyafet görselleri (kategori + cinsiyetle örtüşen, kıyafet ön planda) ----
// Pexels: URL deseni ID'den türetilir. Unsplash: doğrulanmış hash'ler.
const px = (id: number) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=700`;
const un = (hash: string) => `https://images.unsplash.com/photo-${hash}?fm=jpg&q=70&w=700&auto=format&fit=crop`;

const IMG = {
  womanDress: px(10693948),      // kadın elbise
  womanBoutique: px(1488463),    // kadın giyim reyonu
  womanModel: un('1633994048003-071f6c11e26a'), // kadın manken/elbise
  manA: px(2664705),             // erkek tişört + jean
  manB: px(21758981),            // erkek beyaz tişört + jean
  manC: px(27744210),            // erkek gömlek + jean
  manD: px(21705869),            // erkek tişört (parkta)
  tshirtPile: un('1716951980904-fbe5c5aa2279'), // katlı tişörtler
  jeans: px(16069734),           // jean/pantolon + sneaker
  sneaker: un('1676379827610-c380c52db0c6'),    // spor ayakkabı
  shoesBag: px(336372),          // ayakkabı + çanta (aksesuar)
  shoesBoxes: px(2908975),       // ayakkabı kutuları
};

// Ürünün kategori + cinsiyetine göre uygun görsel havuzu (ilki en iyi eşleşen = kapak)
function poolFor(parentName: string, subName: string): string[] {
  if (parentName === 'Ayakkabı') return [IMG.sneaker, IMG.shoesBoxes, IMG.shoesBag];
  if (parentName === 'Aksesuar') return [IMG.shoesBag, IMG.womanBoutique, IMG.shoesBoxes, IMG.womanModel];

  let pool: string[];
  if (parentName === 'Erkek') pool = [IMG.tshirtPile, IMG.manA, IMG.manB, IMG.manC, IMG.manD, IMG.jeans];
  else if (parentName === 'Çocuk') pool = [IMG.tshirtPile, IMG.womanModel, IMG.manB, IMG.womanBoutique, IMG.jeans];
  else pool = [IMG.womanModel, IMG.womanDress, IMG.womanBoutique, IMG.jeans, IMG.shoesBag]; // Kadın

  // Kıyafet türüne göre kapak görselini öne al
  const hero =
    subName === 'Elbise' || subName === 'Etek' ? IMG.womanDress :
    subName === 'Pantolon' || subName === 'Şort' ? IMG.jeans : null;
  if (hero) pool = [hero, ...pool.filter((u) => u !== hero)];
  return pool;
}

// Bir ürün için 5 görsel: kapak (slot 0) türle örtüşür, kalan 4 havuzdan çeşitlenir
function makeImages(parentName: string, subName: string, offset: number) {
  const pool = poolFor(parentName, subName);
  const images = [];
  for (let i = 0; i < 5; i++) {
    const idx = i === 0 ? 0 : ((i - 1 + offset) % (pool.length - 1)) + 1;
    images.push({ url: pool[idx], isPrimary: i === 0, sortOrder: i });
  }
  return images;
}

const COLORS = ['Beyaz', 'Siyah', 'Lacivert', 'Gri', 'Kırmızı', 'Yeşil', 'Mavi', 'Bej', 'Pembe', 'Kahverengi'];
const SIZES_CLOTHING = ['XS', 'S', 'M', 'L', 'XL'];
const SIZES_SHOE = ['38', '39', '40', '41', '42', '43'];
const MATERIALS = ['%100 Pamuk', '%80 Pamuk %20 Polyester', 'Keten', 'Denim', 'Örme Triko', 'Deri', 'Viskon'];
const BRANDS = ['Moda Basics', 'Urban Style', 'Classic Wear', 'Trend Co', 'Denim Lab', 'Elite Fashion'];
const STYLES = ['Casual', 'Klasik', 'Spor', 'Grunge', 'Gothic', 'Streetwear', 'Bohem', 'Minimalist', 'Vintage', 'Şık'];

// Kategori tipine göre uygun kesim (fit) seçenekleri
function fitOptions(subName: string, parentName: string): string[] {
  if (parentName === 'Ayakkabı') return ['Dar Kalıp', 'Normal Kalıp', 'Geniş Kalıp'];
  if (parentName === 'Aksesuar') return ['Standart'];
  if (subName === 'Pantolon') return ['Skinny', 'Slim Fit', 'Regular', 'Bol Paça', 'Düz Kesim', 'Jogger'];
  if (subName === 'Elbise' || subName === 'Etek') return ['Dar Kalıp', 'Regular', 'Salaş'];
  if (subName === 'Şort') return ['Slim Fit', 'Regular', 'Bol'];
  if (subName === 'Ceket') return ['Slim Fit', 'Regular', 'Oversize'];
  // tişört, gömlek, kazak, sweatshirt
  return ['Slim Fit', 'Regular', 'Oversize', 'Crop'];
}

async function main() {
  console.log('🌱 Seed başlıyor...');

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shop.com' }, update: {},
    create: { email: 'admin@shop.com', passwordHash: adminPassword, firstName: 'Admin', lastName: 'User', role: 'ADMIN' },
  });
  const userPassword = await bcrypt.hash('User123!', 10);
  await prisma.user.upsert({
    where: { email: 'user@shop.com' }, update: {},
    create: { email: 'user@shop.com', passwordHash: userPassword, firstName: 'Test', lastName: 'Kullanıcı', role: 'CUSTOMER' },
  });

  const categoryTree: Record<string, string[]> = {
    Kadın: ['Tişört', 'Gömlek', 'Elbise', 'Pantolon', 'Etek', 'Ceket', 'Kazak', 'Sweatshirt'],
    Erkek: ['Tişört', 'Gömlek', 'Pantolon', 'Ceket', 'Kazak', 'Sweatshirt', 'Şort'],
    Çocuk: ['Tişört', 'Pantolon', 'Elbise', 'Sweatshirt'],
    Ayakkabı: ['Spor Ayakkabı', 'Bot', 'Sandalet', 'Klasik Ayakkabı'],
    Aksesuar: ['Çanta', 'Kemer', 'Şapka', 'Atkı', 'Gözlük'],
  };

  const subCategoryIds: { id: string; name: string; parentName: string }[] = [];
  for (const [parentName, children] of Object.entries(categoryTree)) {
    const parent = await prisma.category.upsert({
      where: { slug: slugify(parentName) }, update: {},
      create: { name: parentName, slug: slugify(parentName) },
    });
    for (const childName of children) {
      const childSlug = slugify(`${parentName}-${childName}`);
      const child = await prisma.category.upsert({
        where: { slug: childSlug }, update: {},
        create: { name: childName, slug: childSlug, parentId: parent.id },
      });
      subCategoryIds.push({ id: child.id, name: childName, parentName });
    }
  }
  console.log(`✅ ${Object.keys(categoryTree).length} üst + ${subCategoryIds.length} alt kategori`);

  const productNames: Record<string, string[]> = {
    Tişört: ['Basic Tişört', 'Oversize Tişört', 'V Yaka Tişört', 'Baskılı Tişört'],
    Gömlek: ['Klasik Gömlek', 'Keten Gömlek', 'Oduncu Gömlek'],
    Elbise: ['Yazlık Elbise', 'Midi Elbise', 'Kot Elbise'],
    Pantolon: ['Slim Fit Pantolon', 'Jogger Pantolon', 'Kumaş Pantolon'],
    Etek: ['Mini Etek', 'Midi Etek'],
    Ceket: ['Deri Ceket', 'Denim Ceket', 'Blazer Ceket'],
    Kazak: ['Boğazlı Kazak', 'Örme Kazak'],
    Sweatshirt: ['Kapüşonlu Sweatshirt', 'Basic Sweatshirt'],
    Şort: ['Denim Şort', 'Keten Şort'],
    'Spor Ayakkabı': ['Koşu Ayakkabısı', 'Sneaker'],
    Bot: ['Deri Bot', 'Kışlık Bot'],
    Sandalet: ['Yazlık Sandalet'],
    'Klasik Ayakkabı': ['Klasik Oxford'],
    Çanta: ['Sırt Çantası', 'Omuz Çantası'],
    Kemer: ['Deri Kemer'],
    Şapka: ['Beyzbol Şapkası', 'Bere'],
    Atkı: ['Yün Atkı'],
    Gözlük: ['Güneş Gözlüğü'],
  };

  let productCount = 0;
  let priceBase = 149;

  for (const cat of subCategoryIds) {
    const names = productNames[cat.name] || ['Ürün'];
    const isShoe = cat.parentName === 'Ayakkabı';
    const fits = fitOptions(cat.name, cat.parentName);

    for (const baseName of names) {
      const fullName = `${cat.parentName} ${baseName}`;
      const slug = slugify(`${cat.parentName}-${baseName}-${productCount}`);
      const price = priceBase + ((productCount * 37) % 1200);
      priceBase = 99 + ((priceBase + 53) % 400);

      let discountPrice: number | null = null;
      if (productCount % 3 === 0) {
        const pct = 15 + (productCount % 4) * 8;
        discountPrice = Math.round(price * (1 - pct / 100) * 100) / 100;
      }
      const isFeatured = productCount % 5 === 0;
      const style = STYLES[productCount % STYLES.length];
      const fit = fits[productCount % fits.length];

      const sizes = isShoe ? SIZES_SHOE.slice(0, 5) : SIZES_CLOTHING;
      const colorCount = 2 + (productCount % 3);
      const chosenColors = COLORS.slice(productCount % 6, (productCount % 6) + colorCount);

      const variants = [];
      let vi = 0;
      for (const color of chosenColors) {
        for (const size of sizes) {
          variants.push({
            size, color,
            sku: `${slug}-${color.slice(0, 2)}-${size}`.toUpperCase(),
            stock: (vi % 6 === 0) ? 0 : 3 + ((vi * 7) % 25),
            priceDiff: vi % 7 === 0 ? 30 : 0,
          });
          vi++;
        }
      }

      await prisma.product.upsert({
        where: { slug }, update: {},
        create: {
          name: fullName, slug,
          description: `${fullName} — ${style.toLowerCase()} tarzı, ${fit.toLowerCase()} kesim. Modern tasarım, kaliteli kumaş. ${cat.parentName} koleksiyonunun favori parçalarından.`,
          basePrice: price, discountPrice, isFeatured, style, fit,
          categoryId: cat.id,
          material: MATERIALS[productCount % MATERIALS.length],
          careInfo: '30°C\'de yıkayın, ütü orta ısı, kuru temizlemeye vermeyin.',
          brand: BRANDS[productCount % BRANDS.length],
          variants: { create: variants },
          images: { create: makeImages(cat.parentName, cat.name, productCount) },
        },
      });
      productCount++;
    }
  }

  const discounted = await prisma.product.count({ where: { discountPrice: { not: null } } });
  const featured = await prisma.product.count({ where: { isFeatured: true } });
  console.log(`✅ ${productCount} ürün (${discounted} indirimli, ${featured} öne çıkan), her biri 5 karakter görseli`);
  console.log('✅ Seed tamamlandı! Admin: admin@shop.com/Admin123! · Kullanıcı: user@shop.com/User123!');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
