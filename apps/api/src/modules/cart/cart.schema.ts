import { z } from 'zod';

export const addToCartSchema = z.object({
  variantId: z.string().uuid('Geçerli bir varyant seçin'),
  quantity: z.number().int().min(1, 'Adet en az 1 olmalı').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Adet en az 1 olmalı'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
