import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin kullanıcı
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

  // Kategori
  const tshirtCategory = await prisma.category.upsert({
    where: { slug: 'tisort' },
    update: {},
    create: { name: 'Tişört', slug: 'tisort' },
  });

  // Örnek ürün + varyantlar
  const product = await prisma.product.upsert({
    where: { slug: 'basic-pamuklu-tisort' },
    update: {},
    create: {
      name: 'Basic Pamuklu Tişört',
      slug: 'basic-pamuklu-tisort',
      description: '%100 pamuklu, rahat kesim basic tişört.',
      basePrice: 199.9,
      categoryId: tshirtCategory.id,
      variants: {
        create: [
          { size: 'S', color: 'Beyaz', sku: 'TS-BEYAZ-S', stock: 10 },
          { size: 'M', color: 'Beyaz', sku: 'TS-BEYAZ-M', stock: 15 },
          { size: 'L', color: 'Siyah', sku: 'TS-SIYAH-L', stock: 8 },
        ],
      },
      images: {
        create: [
          {
            url: 'https://via.placeholder.com/600x800?text=Tisort',
            isPrimary: true,
          },
        ],
      },
    },
  });

  console.log('✅ Seed tamamlandı:', {
    admin: admin.email,
    product: product.name,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
