import { prisma } from '../../config/prisma';
import { OrderStatus } from '@prisma/client';

const orderInclude = {
  items: {
    include: {
      variant: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      },
    },
  },
  payment: true,
} as const;

export const orderRepository = {
  // Kullanıcının sepetini kalemleriyle getir (checkout için)
  findCartWithItems: (userId: string) =>
    prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { variant: { include: { product: true } } } },
      },
    }),

  findAddress: (addressId: string) =>
    prisma.address.findUnique({ where: { id: addressId } }),

  findByUser: (userId: string) =>
    prisma.order.findMany({
      where: { userId },
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    }),

  findById: (id: string) =>
    prisma.order.findUnique({ where: { id }, include: orderInclude }),

  // Admin: tüm siparişler
  findAll: () =>
    prisma.order.findMany({
      include: {
        ...orderInclude,
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

  updateStatus: (id: string, status: OrderStatus) =>
    prisma.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    }),
};
