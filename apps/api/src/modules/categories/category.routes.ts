import { Router } from 'express';
import { categoryController } from './category.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import {
  createCategorySchema,
  updateCategorySchema,
} from './category.schema';

const router = Router();

// Herkese açık okuma
router.get('/', categoryController.list);
router.get('/:id', categoryController.getById);

// Sadece ADMIN yazma işlemleri
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createCategorySchema),
  categoryController.create
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateCategorySchema),
  categoryController.update
);
router.delete('/:id', authenticate, authorize('ADMIN'), categoryController.remove);

export default router;
