export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const NotFound = (msg = 'Kayıt bulunamadı') => new AppError(404, msg);
export const BadRequest = (msg = 'Geçersiz istek') => new AppError(400, msg);
export const Unauthorized = (msg = 'Yetkisiz erişim') => new AppError(401, msg);
export const Forbidden = (msg = 'Bu işlem için yetkiniz yok') =>
  new AppError(403, msg);
export const Conflict = (msg = 'Kayıt zaten mevcut') => new AppError(409, msg);
