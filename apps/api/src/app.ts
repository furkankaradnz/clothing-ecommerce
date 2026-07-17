import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import {
  errorHandler,
  notFoundHandler,
} from './middlewares/error.middleware';

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

  // Modül route'ları buraya eklenecek (hafta 2+):
  // app.use('/api/auth', authRoutes);
  // app.use('/api/products', productRoutes);
  // app.use('/api/cart', cartRoutes);
  // app.use('/api/orders', orderRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
