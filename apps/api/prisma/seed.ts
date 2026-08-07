import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

// Yardımcı: slug üret
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ğ/g, 'g').replace(/ü/g, 'u')
    .replace(/ş/g, 's').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const COLORS = ['Beyaz', 'Siyah', 'Lacivert', 'Gri', 'Kırmızı', 'Yeşil', 'Mavi', 'Bej'];
const SIZES_CLOTHING = ['XS', 'S', 'M', 'L', 'XL'];
const SIZES_SHOE = ['38', '39', '40', '41', '42', '43', '44'];
const MATERIALS = ['%100 Pamuk', '%80 Pamuk %20 Polyester', 'Keten', 'Denim', 'Örme', 'Deri'];
const BRANDS = ['Moda Basics', 'Urban Style', 'Classic Wear', 'Trend Co', 'Denim Lab'];

async function main() {
  console.log('🌱 Seed başlıyor...');

  // ---- Kullanıcılar ----
  const adminPassword = await bcrypt.hash('Admin123!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shop.com' },
    update: {},
    create: {
      email: 'admin@shop.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  const userPassword = await bcrypt.hash('User123!', 10);
  await prisma.user.upsert({
    where: { email: 'user@shop.com' },
    update: {},
    create: {
      email: 'user@shop.com',
      passwordHash: userPassword,
      firstName: 'Test',
      lastName: 'Kullanıcı',
      role: 'CUSTOMER',
    },
  });

  // ---- Kategori ağacı ----
  // Üst kategoriler ve alt kategorileri
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
      where: { slug: slugify(parentName) },
      update: {},
      create: { name: parentName, slug: slugify(parentName) },
    });

    for (const childName of children) {
      // Alt kategori slug'ı benzersiz olmalı: "erkek-tisort" gibi
      const childSlug = slugify(`${parentName}-${childName}`);
      const child = await prisma.category.upsert({
        where: { slug: childSlug },
        update: {},
        create: { name: childName, slug: childSlug, parentId: parent.id },
      });
      subCategoryIds.push({ id: child.id, name: childName, parentName });
    }
  }

  console.log(`✅ ${Object.keys(categoryTree).length} üst + ${subCategoryIds.length} alt kategori`);

  // ---- Ürünler ----
  // Her alt kategori için birkaç ürün üret (fiyat/renk/beden çeşitliliğiyle)
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

    for (const baseName of names) {
      const fullName = `${cat.parentName} ${baseName}`;
      const slug = slugify(`${cat.parentName}-${baseName}-${productCount}`);
      // Fiyatı çeşitlendir (99 - 1499 arası dağılım)
      const price = priceBase + ((productCount * 37) % 1200);
      priceBase = 99 + ((priceBase + 53) % 400);

      // Varyantlar: 2-3 renk x uygun bedenler
      const sizes = isShoe ? SIZES_SHOE.slice(0, 4) : SIZES_CLOTHING;
      const colorCount = 2 + (productCount % 2); // 2 veya 3 renk
      const chosenColors = COLORS.slice(
        productCount % 4,
        (productCount % 4) + colorCount
      );

      const variants = [];
      let variantIdx = 0;
      for (const color of chosenColors) {
        for (const size of sizes) {
          variants.push({
            size,
            color,
            sku: `${slug}-${color.slice(0, 2)}-${size}`.toUpperCase(),
            // Bazı varyantları stoksuz bırak (filtreleme/tükendi demosu için)
            stock: (variantIdx % 5 === 0) ? 0 : 3 + ((variantIdx * 7) % 20),
            priceDiff: variantIdx % 6 === 0 ? 25 : 0,
          });
          variantIdx++;
        }
      }

      await prisma.product.upsert({
        where: { slug },
        update: {},
        create: {
          name: fullName,
          slug,
          description: `${fullName} — rahat, şık ve kaliteli. Günlük kullanıma uygun, modern kesim. ${cat.parentName} koleksiyonunun öne çıkan parçalarından.`,
          basePrice: price,
          categoryId: cat.id,
          material: MATERIALS[productCount % MATERIALS.length],
          careInfo: '30°C\'de yıkayın, ütü orta ısı, kuru temizlemeye vermeyin.',
          brand: BRANDS[productCount % BRANDS.length],
          variants: { create: variants },
          images: {
            create: [
              {
                url: `https://placehold.co/600x800/e0e7ff/4f46e5?text=${encodeURIComponent(baseName)}`,
                isPrimary: true,
                sortOrder: 0,
              },
              {
                url: `https://placehold.co/600x800/f3f4f6/6b7280?text=${encodeURIComponent(cat.parentName)}`,
                isPrimary: false,
                sortOrder: 1,
              },
            ],
          },
        },
      });
      productCount++;
    }
  }

  console.log(`✅ ${productCount} ürün oluşturuldu (varyantlarıyla)`);
  console.log('✅ Seed tamamlandı!');
  console.log('   Admin:', admin.email, '/ Admin123!');
  console.log('   Kullanıcı: user@shop.com / User123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
