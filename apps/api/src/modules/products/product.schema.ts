import { z } from 'zod';

// Varyant (beden + renk + stok)
const variantSchema = z.object({
  size: z.string().min(1, 'Beden gerekli'),
  color: z.string().min(1, 'Renk gerekli'),
  sku: z.string().min(1, 'SKU gerekli'),
  stock: z.number().int().min(0, 'Stok negatif olamaz'),
  priceDiff: z.number().default(0),
});

export const createProductSchema = z.object({
  name: z.string().min(2, 'Ürün adı en az 2 karakter olmalı'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
  description: z.string().min(10, 'Açıklama en az 10 karakter olmalı'),
  basePrice: z.number().positive('Fiyat pozitif olmalı'),
  categoryId: z.string().uuid('Geçerli bir kategori seçin'),
  isActive: z.boolean().default(true),
  // Tam olarak 5 ürün görseli zorunlu
  images: z
    .array(z.string().url('Geçerli bir görsel URL\'si girin'))
    .length(5, 'Tam olarak 5 görsel eklemelisiniz'),
  variants: z.array(variantSchema).min(1, 'En az bir varyant gerekli'),
});

export const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().min(10).optional(),
  basePrice: z.number().positive().optional(),
  categoryId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});

// Liste filtreleme parametreleri (query string'den gelir, hepsi string)
export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  category: z.string().optional(), // slug
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  size: z.string().optional(), // beden filtresi
  color: z.string().optional(), // renk filtresi
  style: z.string().optional(), // tarz filtresi
  fit: z.string().optional(), // kesim filtresi
  onSale: z.coerce.boolean().optional(), // sadece indirimdekiler
  featured: z.coerce.boolean().optional(), // sadece öne çıkanlar
  sort: z
    .enum(['newest', 'price-asc', 'price-desc', 'name-asc'])
    .default('newest'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQuery = z.infer<typeof productQuerySchema>;
