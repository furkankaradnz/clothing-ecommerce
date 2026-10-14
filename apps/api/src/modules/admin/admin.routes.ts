import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Tüm admin route'ları giriş + ADMIN yetkisi gerektirir
router.use(authenticate, authorize('ADMIN'));

router.get('/stats', adminController.stats);
router.get('/users', adminController.users);

export default router;
