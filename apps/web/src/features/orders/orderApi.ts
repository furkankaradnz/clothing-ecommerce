import { api } from '../../lib/api';
import type { Order, PaymentForm, OrderStatus } from '../../types/order';

export const orderApi = {
  create: async (
    addressId: string,
    payment: PaymentForm
  ): Promise<Order> => {
    const { data } = await api.post('/orders', { addressId, payment });
    return data.data;
  },
  listMine: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders');
    return data.data;
  },
  getMine: async (id: string): Promise<Order> => {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  },
  // Admin
  listAll: async (): Promise<Order[]> => {
    const { data } = await api.get('/orders/admin/all');
    return data.data;
  },
  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const { data } = await api.patch(`/orders/admin/${id}/status`, { status });
    return data.data;
  },
};
