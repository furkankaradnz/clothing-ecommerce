import { api } from '../../lib/api';
import type { Address } from '../../types/cart';

interface AddressPayload {
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  zipCode?: string;
  isDefault?: boolean;
}

export const addressApi = {
  list: async (): Promise<Address[]> => {
    const { data } = await api.get('/addresses');
    return data.data;
  },
  create: async (payload: AddressPayload): Promise<Address> => {
    const { data } = await api.post('/addresses', payload);
    return data.data;
  },
  remove: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },
};
