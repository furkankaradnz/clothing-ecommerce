import { z } from 'zod';

export const createAddressSchema = z.object({
  title: z.string().min(1, 'Başlık gerekli (örn: Ev, İş)'),
  fullName: z.string().min(2, 'Ad soyad gerekli'),
  phone: z.string().min(10, 'Geçerli bir telefon girin'),
  city: z.string().min(2, 'Şehir gerekli'),
  district: z.string().min(2, 'İlçe gerekli'),
  fullAddress: z.string().min(10, 'Açık adres en az 10 karakter olmalı'),
  zipCode: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
