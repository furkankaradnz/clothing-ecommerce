import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';
import { CreateProductInput, UpdateProductInput } from './product.schema';

export const productRepository = {
  // Filtreli + sayfalı liste. where ve orderBy service'te hazırlanır.
  findMany: (
    where: Prisma.ProductWhereInput,
    orderBy: Prisma.ProductOrderByWithRelationInput,
    skip: number,
    take: number
  ) =>
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        variants: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
    }),

  count: (where: Prisma.ProductWhereInput) =>
    prisma.product.count({ where }),

  findById: (id: string) =>
    prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        images: { orderBy: { sortOrder: 'asc' } },
        reviews: {
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
    }),

  findBySlug: (slug: string) =>
    prisma.product.findUnique({
      where: { slug },
      include: { category: true, variants: true, images: true },
    }),

  // Ürün + varyantları tek transaction'da oluştur
  create: (data: CreateProductInput) =>
    prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        basePrice: data.basePrice,
        categoryId: data.categoryId,
        isActive: data.isActive,
        variants: { create: data.variants },
        // 5 görseli sırayla kaydet; ilki birincil (kapak) görsel
        images: {
          create: data.images.map((url, i) => ({
            url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
      },
      include: { variants: true, category: true, images: true },
    }),

  update: (id: string, data: UpdateProductInput) =>
    prisma.product.update({
      where: { id },
      data,
      include: { variants: true, category: true },
    }),

  delete: (id: string) => prisma.product.delete({ where: { id } }),
};
