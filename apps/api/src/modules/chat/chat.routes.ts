import { Router } from 'express';
import { chatController } from './chat.controller';
import { validate } from '../../middlewares/validate.middleware';
import { chatSchema } from './chat.schema';

const router = Router();

// Herkese açık - giriş gerektirmez (ürün önerisi için)
router.post('/', validate(chatSchema), chatController.chat);

export default router;
