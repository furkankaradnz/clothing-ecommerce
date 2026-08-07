import { z } from 'zod';

// Sahte kredi kartı - format doğrulaması yapılır ama gerçek çekim yok
const paymentSchema = z.object({
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, 'Kart numarası 16 haneli olmalı'),
  cardHolder: z.string().min(2, 'Kart sahibi adı gerekli'),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Son kullanma AA/YY formatında olmalı'),
  cvv: z.string().regex(/^\d{3}$/, 'CVV 3 haneli olmalı'),
});

export const createOrderSchema = z.object({
  addressId: z.string().uuid('Geçerli bir teslimat adresi seçin'),
  payment: paymentSchema,
});

// Admin sipariş durumu güncelleme
export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
