import { prisma } from '../../config/prisma';
import { CreateAddressInput, UpdateAddressInput } from './address.schema';

export const addressRepository = {
  findByUser: (userId: string) =>
    prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
    }),

  findById: (id: string) => prisma.address.findUnique({ where: { id } }),

  create: (userId: string, data: CreateAddressInput) =>
    prisma.address.create({ data: { ...data, userId } }),

  update: (id: string, data: UpdateAddressInput) =>
    prisma.address.update({ where: { id }, data }),

  delete: (id: string) => prisma.address.delete({ where: { id } }),

  // Bir kullanıcının tüm adreslerinin varsayılanını kaldır
  // (yeni varsayılan atanırken eskisini sıfırlamak için)
  clearDefault: (userId: string) =>
    prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    }),
};
