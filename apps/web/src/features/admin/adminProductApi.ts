import { api } from '../../lib/api';
import type { Product, Category } from '../../types/product';

export interface VariantInput {
  size: string;
  color: string;
  sku: string;
  stock: number;
  priceDiff?: number;
}

export interface ProductInput {
  name: string;
  slug: string;
  description: string;
  basePrice: number;
  categoryId: string;
  isActive?: boolean;
  variants: VariantInput[];
}

export const adminProductApi = {
  // Admin için tüm ürünleri çek (yüksek limit)
  list: async (): Promise<Product[]> => {
    const { data } = await api.get('/products?limit=100');
    return data.products;
  },
  categories: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data.data;
  },
  create: async (payload: ProductInput): Promise<Product> => {
    const { data } = await api.post('/products', payload);
    return data.data;
  },
  update: async (
    id: string,
    payload: Partial<Omit<ProductInput, 'variants'>>
  ): Promise<Product> => {
    const { data } = await api.patch(`/products/${id}`, payload);
    return data.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
