import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import categoryRoutes from './modules/categories/category.routes';
import productRoutes from './modules/products/product.routes';
import cartRoutes from './modules/cart/cart.routes';
import addressRoutes from './modules/addresses/address.routes';
import orderRoutes from './modules/orders/order.routes';
import reviewRoutes from './modules/reviews/review.routes';
import chatRoutes from './modules/chat/chat.routes';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(morgan('dev'));

  // Sağlık kontrolü
  app.get('/api/health', (_req, res) => {
    res.json({
      success: true,
      message: 'API çalışıyor',
      timestamp: new Date().toISOString(),
    });
  });

  // Modül route'ları
  app.use('/api/auth', authRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/addresses', addressRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/chat', chatRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
