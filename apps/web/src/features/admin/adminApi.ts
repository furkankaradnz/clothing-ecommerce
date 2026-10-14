import { api } from '../../lib/api';

export interface DashboardStats {
  totals: {
    products: number;
    orders: number;
    users: number;
    reviews: number;
    revenue: number;
  };
  ordersByStatus: { status: string; count: number }[];
  lowStock: {
    id: string;
    product: string;
    size: string;
    color: string;
    stock: number;
  }[];
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

export const adminApi = {
  stats: async (): Promise<DashboardStats> => {
    const { data } = await api.get('/admin/stats');
    return data.data;
  },
  users: async (): Promise<AdminUser[]> => {
    const { data } = await api.get('/admin/users');
    return data.data;
  },
};
