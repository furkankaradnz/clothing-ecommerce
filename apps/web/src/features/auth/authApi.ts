import { api } from '../../lib/api';
import type { AuthResponse } from '../../types/auth';

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', payload);
    return data.data;
  },
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', payload);
    return data.data;
  },
};
