import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from './cartApi';
import { useAuthStore } from '../../store/authStore';

// Sepeti çeker (sadece giriş yapılmışsa)
export function useCart() {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
    enabled: !!user, // giriş yoksa istek atma
  });
}

// Sepete ekle
export function useAddToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ variantId, quantity }: { variantId: string; quantity?: number }) =>
      cartApi.add(variantId, quantity),
    onSuccess: (data) => qc.setQueryData(['cart'], data),
  });
}

// Adet güncelle
export function useUpdateCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: (data) => qc.setQueryData(['cart'], data),
  });
}

// Kalem kaldır
export function useRemoveCartItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (data) => qc.setQueryData(['cart'], data),
  });
}
