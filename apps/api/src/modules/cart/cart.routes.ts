import { Router } from 'express';
import { cartController } from './cart.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { addToCartSchema, updateCartItemSchema } from './cart.schema';

const router = Router();

// Tüm sepet işlemleri giriş gerektirir
router.use(authenticate);

router.get('/', cartController.get);
router.post('/items', validate(addToCartSchema), cartController.add);
router.patch(
  '/items/:itemId',
  validate(updateCartItemSchema),
  cartController.update
);
router.delete('/items/:itemId', cartController.remove);
router.delete('/', cartController.clear);

export default router;
