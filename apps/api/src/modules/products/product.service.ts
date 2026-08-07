import { Prisma } from '@prisma/client';
import { productRepository } from './product.repository';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductQuery,
} from './product.schema';
import { Conflict, NotFound } from '../../common/errors/AppError';

// Sıralama seçeneğini Prisma orderBy'a çevirir
function buildOrderBy(
  sort: ProductQuery['sort']
): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case 'price-asc':
      return { basePrice: 'asc' };
    case 'price-desc':
      return { basePrice: 'desc' };
    case 'name-asc':
      return { name: 'asc' };
    case 'newest':
    default:
      return { createdAt: 'desc' };
  }
}

// Query parametrelerinden Prisma where filtresi kurar
function buildWhere(query: ProductQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = { isActive: true };

  // Kategori (slug ile) - üst kategoriyse alt kategorilerdeki ürünleri de getir
  if (query.category) {
    where.category = {
      OR: [
        { slug: query.category }, // tam eşleşme (alt kategori)
        { parent: { slug: query.category } }, // üst kategoriyse çocuklarını dahil et
      ],
    };
  }

  // Arama: ürün adı veya açıklamada (büyük/küçük harf duyarsız)
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  // Fiyat aralığı
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.basePrice = {};
    if (query.minPrice !== undefined) where.basePrice.gte = query.minPrice;
    if (query.maxPrice !== undefined) where.basePrice.lte = query.maxPrice;
  }

  // Beden/renk: en az bir varyantı eşleşen ürünler
  const variantFilter: Prisma.ProductVariantWhereInput = {};
  if (query.size) variantFilter.size = query.size;
  if (query.color)
    variantFilter.color = { equals: query.color, mode: 'insensitive' };
  if (Object.keys(variantFilter).length > 0) {
    where.variants = { some: variantFilter };
  }

  return where;
}

export const productService = {
  async list(query: ProductQuery) {
    const where = buildWhere(query);
    const orderBy = buildOrderBy(query.sort);
    const skip = (query.page - 1) * query.limit;

    // Liste ve toplam sayıyı paralel çek
    const [products, total] = await Promise.all([
      productRepository.findMany(where, orderBy, skip, query.limit),
      productRepository.count(where),
    ]);

    return {
      products,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  },

  async getById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw NotFound('Ürün bulunamadı');
    return product;
  },

  async getBySlug(slug: string) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw NotFound('Ürün bulunamadı');
    return product;
  },

  async create(input: CreateProductInput) {
    const existing = await productRepository.findBySlug(input.slug);
    if (existing) throw Conflict('Bu slug zaten kullanımda');
    return productRepository.create(input);
  },

  async update(id: string, input: UpdateProductInput) {
    await this.getById(id);
    if (input.slug) {
      const existing = await productRepository.findBySlug(input.slug);
      if (existing && existing.id !== id) {
        throw Conflict('Bu slug zaten kullanımda');
      }
    }
    return productRepository.update(id, input);
  },

  async remove(id: string) {
    await this.getById(id);
    return productRepository.delete(id);
  },
};
