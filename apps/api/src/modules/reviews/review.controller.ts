import { Request, Response } from 'express';
import { reviewService } from './review.service';
import { asyncHandler } from '../../common/utils/asyncHandler';

export const reviewController = {
  // Ürünün yorumları (herkese açık)
  listForProduct: asyncHandler(async (req: Request, res: Response) => {
    const result = await reviewService.listForProduct(req.params.productId);
    res.json({ success: true, ...result });
  }),

  // Yorum ekle (giriş + satın alma gerekli)
  create: asyncHandler(async (req: Request, res: Response) => {
    const review = await reviewService.create(
      req.params.productId,
      req.user!.userId,
      req.body
    );
    res.status(201).json({ success: true, data: review });
  }),

  // Yorum sil (kendi yorumu ya da admin)
  remove: asyncHandler(async (req: Request, res: Response) => {
    await reviewService.remove(
      req.params.id,
      req.user!.userId,
      req.user!.role
    );
    res.json({ success: true, message: 'Yorum silindi' });
  }),
};
