import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../common/utils/jwt';
import { Unauthorized, Forbidden } from '../common/errors/AppError';

// Token'ı doğrular ve req.user'a payload'ı ekler
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw Unauthorized('Token bulunamadı');
  }

  const token = header.split(' ')[1];

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    throw Unauthorized('Geçersiz veya süresi dolmuş token');
  }
}

// Belirli rolleri zorunlu kılar. Örn: authorize('ADMIN')
export function authorize(...roles: Array<'CUSTOMER' | 'ADMIN'>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw Unauthorized('Kimlik doğrulanmadı');
    }
    if (!roles.includes(req.user.role)) {
      throw Forbidden('Bu işlem için yetkiniz yok');
    }
    next();
  };
}
