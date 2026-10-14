import { prisma } from '../../config/prisma';

export const adminService = {
  // Dashboard istatistikleri
  async getStats() {
    const [
      productCount,
      orderCount,
      userCount,
      reviewCount,
      revenueAgg,
      statusGroups,
      lowStockVariants,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.review.count(),
      // Toplam ciro (iptal olmayan siparişler)
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: { not: 'CANCELLED' } },
      }),
      // Sipariş durumu dağılımı
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      // Stoğu azalan varyantlar (< 5)
      prisma.productVariant.findMany({
        where: { stock: { lt: 5 } },
        include: { product: { select: { name: true } } },
        orderBy: { stock: 'asc' },
        take: 10,
      }),
    ]);

    return {
      totals: {
        products: productCount,
        orders: orderCount,
        users: userCount,
        reviews: reviewCount,
        revenue: Number(revenueAgg._sum.totalPrice || 0),
      },
      ordersByStatus: statusGroups.map((g: any) => ({
        status: g.status,
        count: g._count.status,
      })),
      lowStock: lowStockVariants.map((v: any) => ({
        id: v.id,
        product: v.product.name,
        size: v.size,
        color: v.color,
        stock: v.stock,
      })),
    };
  },

  // Kullanıcı listesi (admin)
  async listUsers() {
    return prisma.user.findMany({
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
