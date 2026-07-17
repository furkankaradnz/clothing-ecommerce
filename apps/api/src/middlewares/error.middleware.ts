import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../common/errors/AppError';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Doğrulama hatası',
      errors: err.issues.map((i) => ({
        field: i.path.join('.'),
        message: i.message,
      })),
    });
  }

  console.error('[UNHANDLED]', err);
  return res.status(500).json({
    success: false,
    message: 'Sunucu hatası',
  });
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({ success: false, message: 'Endpoint bulunamadı' });
}
