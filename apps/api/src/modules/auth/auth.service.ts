import { authRepository } from './auth.repository';
import { RegisterInput, LoginInput } from './auth.schema';
import { hashPassword, comparePassword } from '../../common/utils/password';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../common/utils/jwt';
import {
  Conflict,
  Unauthorized,
  NotFound,
} from '../../common/errors/AppError';

// Kullanıcı nesnesinden şifre hash'ini çıkarır (asla client'a dönmemeli)
function toPublicUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await authRepository.findByEmail(input.email);
    if (existing) {
      throw Conflict('Bu e-posta zaten kayıtlı');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await authRepository.create({
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    const payload = { userId: user.id, role: user.role };
    return {
      user: toPublicUser(user),
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  },

  async login(input: LoginInput) {
    const user = await authRepository.findByEmail(input.email);
    if (!user) {
      throw Unauthorized('E-posta veya şifre hatalı');
    }

    const valid = await comparePassword(input.password, user.passwordHash);
    if (!valid) {
      throw Unauthorized('E-posta veya şifre hatalı');
    }

    const payload = { userId: user.id, role: user.role };
    return {
      user: toPublicUser(user),
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  },

  async refresh(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw Unauthorized('Geçersiz veya süresi dolmuş token');
    }

    const user = await authRepository.findById(payload.userId);
    if (!user) {
      throw Unauthorized('Kullanıcı bulunamadı');
    }

    const newPayload = { userId: user.id, role: user.role };
    return {
      accessToken: signAccessToken(newPayload),
      refreshToken: signRefreshToken(newPayload),
    };
  },

  async getProfile(userId: string) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw NotFound('Kullanıcı bulunamadı');
    }
    return toPublicUser(user);
  },
};
