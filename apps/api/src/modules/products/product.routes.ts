import { Router } from 'express';
import { productController } from './product.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import {
  createProductSchema,
  updateProductSchema,
} from './product.schema';

const router = Router();

// Herkese açık okuma (filtreleme query string ile: ?category=&search=&size=&color=&minPrice=&sort=)
router.get('/', productController.list);
router.get('/filters', productController.filters); // filtre seçenekleri
router.get('/slug/:slug', productController.getBySlug);
router.get('/:id', productController.getById);

// Sadece ADMIN yazma
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createProductSchema),
  productController.create
);
router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateProductSchema),
  productController.update
);
router.delete('/:id', authenticate, authorize('ADMIN'), productController.remove);

export default router;
