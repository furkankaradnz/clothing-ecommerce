import { prisma } from '../../config/prisma';
import { Role } from '@prisma/client';

interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}

export const authRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  findById: (id: string) => prisma.user.findUnique({ where: { id } }),

  create: (data: CreateUserData) =>
    prisma.user.create({
      data: { ...data, role: Role.CUSTOMER },
    }),
};
