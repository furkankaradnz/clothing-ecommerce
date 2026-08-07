import { api } from '../../lib/api';
import type { Product } from '../../types/product';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatResponse {
  reply: string;
  products: Product[];
  appliedFilters?: Record<string, unknown>;
}

export const chatApi = {
  send: async (messages: ChatMessage[]): Promise<ChatResponse> => {
    const { data } = await api.post('/chat', { messages });
    return data.data;
  },
};
