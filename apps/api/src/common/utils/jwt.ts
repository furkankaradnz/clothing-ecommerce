import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';

export interface JwtPayload {
  userId: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export const signAccessToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpires,
  } as SignOptions);

export const signRefreshToken = (payload: JwtPayload): string =>
  jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpires,
  } as SignOptions);

export const verifyAccessToken = (token: string): JwtPayload =>
  jwt.verify(token, env.jwt.accessSecret) as JwtPayload;

export const verifyRefreshToken = (token: string): JwtPayload =>
  jwt.verify(token, env.jwt.refreshSecret) as JwtPayload;
