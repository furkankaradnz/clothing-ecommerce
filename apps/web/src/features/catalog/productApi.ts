import { api } from '../../lib/api';
import type {
  Product,
  ProductListResponse,
  ProductFilters,
  FilterOptions,
  Category,
} from '../../types/product';

export const productApi = {
  list: async (filters: ProductFilters = {}): Promise<ProductListResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, String(value));
      }
    });
    const { data } = await api.get(`/products?${params.toString()}`);
    return { products: data.products, pagination: data.pagination };
  },

  filterOptions: async (): Promise<FilterOptions> => {
    const { data } = await api.get('/products/filters');
    return data.data;
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const { data } = await api.get(`/products/slug/${slug}`);
    return data.data;
  },

  categories: async (): Promise<Category[]> => {
    const { data } = await api.get('/categories');
    return data.data;
  },
};
