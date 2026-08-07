import { Router } from 'express';
import { reviewController } from './review.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { createReviewSchema } from './review.schema';

const router = Router();

// Bir ürünün yorumları - herkese açık
router.get('/product/:productId', reviewController.listForProduct);

// Yorum ekle - giriş gerekli (satın alma kontrolü service'te)
router.post(
  '/product/:productId',
  authenticate,
  validate(createReviewSchema),
  reviewController.create
);

// Yorum sil - giriş gerekli (sahiplik/admin kontrolü service'te)
router.delete('/:id', authenticate, reviewController.remove);

export default router;
