import { Router } from 'express';
import { orderController } from './order.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import {
  createOrderSchema,
  updateOrderStatusSchema,
} from './order.schema';

const router = Router();

// --- Admin route'ları (spesifik yollar önce gelmeli) ---
router.get('/admin/all', authenticate, authorize('ADMIN'), orderController.listAll);
router.patch(
  '/admin/:id/status',
  authenticate,
  authorize('ADMIN'),
  validate(updateOrderStatusSchema),
  orderController.updateStatus
);

// --- Kullanıcı route'ları ---
router.use(authenticate); // buradan sonrası giriş gerektirir

router.post('/', validate(createOrderSchema), orderController.create);
router.get('/', orderController.listMine);
router.get('/:id', orderController.getMine);

export default router;
