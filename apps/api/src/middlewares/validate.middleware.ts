import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

// Gelen request body'sini bir Zod şemasına göre doğrular
export const validate =
  (schema: ZodType) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
