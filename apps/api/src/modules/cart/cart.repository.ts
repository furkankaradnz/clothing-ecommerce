import { prisma } from '../../config/prisma';

// Sepeti kalemleri + varyant + ürün bilgisiyle döndürür (toplam hesabı için gerekli)
const cartInclude = {
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
} as const;

export const cartRepository = {
  // Kullanıcının sepetini bul, yoksa oluştur
  async findOrCreate(userId: string) {
    const existing = await prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });
    if (existing) return existing;

    return prisma.cart.create({
      data: { userId },
      include: cartInclude,
    });
  },

  findVariant: (variantId: string) =>
    prisma.productVariant.findUnique({ where: { id: variantId } }),

  findItem: (cartId: string, variantId: string) =>
    prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId, variantId } },
    }),

  findItemById: (itemId: string) =>
    prisma.cartItem.findUnique({ where: { id: itemId } }),

  createItem: (cartId: string, variantId: string, quantity: number) =>
    prisma.cartItem.create({ data: { cartId, variantId, quantity } }),

  updateItem: (itemId: string, quantity: number) =>
    prisma.cartItem.update({ where: { id: itemId }, data: { quantity } }),

  deleteItem: (itemId: string) =>
    prisma.cartItem.delete({ where: { id: itemId } }),

  clearItems: (cartId: string) =>
    prisma.cartItem.deleteMany({ where: { cartId } }),
};
