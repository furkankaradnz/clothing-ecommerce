import { z } from 'zod';

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, 'Puan en az 1 olmalı')
    .max(5, 'Puan en fazla 5 olabilir'),
  comment: z.string().max(1000, 'Yorum en fazla 1000 karakter olabilir').optional(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
