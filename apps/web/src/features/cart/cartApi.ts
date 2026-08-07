import { api } from '../../lib/api';
import type { Cart } from '../../types/cart';

export const cartApi = {
  get: async (): Promise<Cart> => {
    const { data } = await api.get('/cart');
    return data.data;
  },
  add: async (variantId: string, quantity = 1): Promise<Cart> => {
    const { data } = await api.post('/cart/items', { variantId, quantity });
    return data.data;
  },
  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const { data } = await api.patch(`/cart/items/${itemId}`, { quantity });
    return data.data;
  },
  removeItem: async (itemId: string): Promise<Cart> => {
    const { data } = await api.delete(`/cart/items/${itemId}`);
    return data.data;
  },
  clear: async (): Promise<Cart> => {
    const { data } = await api.delete('/cart');
    return data.data;
  },
};
