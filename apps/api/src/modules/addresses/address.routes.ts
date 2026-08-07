import { Router } from 'express';
import { addressController } from './address.controller';
import { validate } from '../../middlewares/validate.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import {
  createAddressSchema,
  updateAddressSchema,
} from './address.schema';

const router = Router();

// Tüm adres işlemleri giriş gerektirir
router.use(authenticate);

router.get('/', addressController.list);
router.post('/', validate(createAddressSchema), addressController.create);
router.patch('/:id', validate(updateAddressSchema), addressController.update);
router.delete('/:id', addressController.remove);

export default router;
