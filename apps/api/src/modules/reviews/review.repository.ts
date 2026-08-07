import { prisma } from '../../config/prisma';
import { CreateReviewInput } from './review.schema';

export const reviewRepository = {
  findByProduct: (productId: string) =>
    prisma.review.findMany({
      where: { productId },
      include: {
        user: { select: { firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),

  findByProductAndUser: (productId: string, userId: string) =>
    prisma.review.findUnique({
      where: { productId_userId: { productId, userId } },
    }),

  findById: (id: string) => prisma.review.findUnique({ where: { id } }),

  create: (productId: string, userId: string, data: CreateReviewInput) =>
    prisma.review.create({
      data: { productId, userId, ...data },
      include: { user: { select: { firstName: true, lastName: true } } },
    }),

  delete: (id: string) => prisma.review.delete({ where: { id } }),

  // Kullanıcı bu ürünü satın almış mı? (teslim edilmiş/ödenmiş siparişlerde var mı)
  // Ürünün herhangi bir varyantı, kullanıcının bir siparişinde geçiyorsa true.
  hasPurchased: async (productId: string, userId: string) => {
    const orderItem = await prisma.orderItem.findFirst({
      where: {
        order: { userId },
        variant: { productId },
      },
    });
    return orderItem !== null;
  },

  // Ürünün ortalama puanı + yorum sayısı
  getStats: async (productId: string) => {
    const result = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true },
    });
    return {
      averageRating: result._avg.rating || 0,
      reviewCount: result._count.rating,
    };
  },
};
