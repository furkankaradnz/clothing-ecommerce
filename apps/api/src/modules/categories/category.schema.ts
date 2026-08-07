import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Kategori adı en az 2 karakter olmalı'),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, rakam ve tire içerebilir'),
  parentId: z.string().uuid().optional().nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
