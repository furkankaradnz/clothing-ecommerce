import { Request, Response, NextFunction } from 'express';

type AsyncFn = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

// Controller içindeki async hataları otomatik olarak errorHandler'a iletir
export const asyncHandler =
  (fn: AsyncFn) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
