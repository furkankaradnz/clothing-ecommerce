import { cartRepository } from './cart.repository';
import { AddToCartInput } from './cart.schema';
import { NotFound, BadRequest, Forbidden } from '../../common/errors/AppError';

// Sepet toplamını hesaplar: her kalem için (temel fiyat + varyant farkı) * adet
function calculateCart(cart: any) {
  const items = cart.items.map((item: any) => {
    const basePrice = Number(item.variant.product.basePrice);
    const priceDiff = Number(item.variant.priceDiff);
    const unitPrice = basePrice + priceDiff;
    const lineTotal = unitPrice * item.quantity;

    return {
      id: item.id,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
      variant: {
        id: item.variant.id,
        size: item.variant.size,
        color: item.variant.color,
        stock: item.variant.stock,
      },
      product: {
        id: item.variant.product.id,
        name: item.variant.product.name,
        slug: item.variant.product.slug,
        image: item.variant.product.images[0]?.url || null,
      },
    };
  });

  const total = items.reduce((sum: number, i: any) => sum + i.lineTotal, 0);
  const itemCount = items.reduce((sum: number, i: any) => sum + i.quantity, 0);

  return { items, total, itemCount };
}

export const cartService = {
  async getCart(userId: string) {
    const cart = await cartRepository.findOrCreate(userId);
    return calculateCart(cart);
  },

  async addItem(userId: string, input: AddToCartInput) {
    const variant = await cartRepository.findVariant(input.variantId);
    if (!variant) throw NotFound('Ürün varyantı bulunamadı');

    const cart = await cartRepository.findOrCreate(userId);
    const existingItem = await cartRepository.findItem(
      cart.id,
      input.variantId
    );

    // Sepette zaten varsa, mevcut adet + yeni adet stoğu aşmamalı
    const desiredQty = (existingItem?.quantity || 0) + input.quantity;
    if (desiredQty > variant.stock) {
      throw BadRequest(
        `Yetersiz stok. Bu varyanttan en fazla ${variant.stock} adet eklenebilir` +
          (existingItem ? ` (sepetinizde zaten ${existingItem.quantity} adet var)` : '')
      );
    }

    if (existingItem) {
      await cartRepository.updateItem(existingItem.id, desiredQty);
    } else {
      await cartRepository.createItem(
        cart.id,
        input.variantId,
        input.quantity
      );
    }

    return this.getCart(userId);
  },

  async updateItem(userId: string, itemId: string, quantity: number) {
    const item = await cartRepository.findItemById(itemId);
    if (!item) throw NotFound('Sepet kalemi bulunamadı');

    // Kalemin bu kullanıcının sepetine ait olduğunu doğrula
    const cart = await cartRepository.findOrCreate(userId);
    if (item.cartId !== cart.id) {
      throw Forbidden('Bu sepet kalemine erişim yetkiniz yok');
    }

    const variant = await cartRepository.findVariant(item.variantId);
    if (!variant) throw NotFound('Varyant bulunamadı');

    if (quantity > variant.stock) {
      throw BadRequest(`Yetersiz stok. En fazla ${variant.stock} adet olabilir`);
    }

    await cartRepository.updateItem(itemId, quantity);
    return this.getCart(userId);
  },

  async removeItem(userId: string, itemId: string) {
    const item = await cartRepository.findItemById(itemId);
    if (!item) throw NotFound('Sepet kalemi bulunamadı');

    const cart = await cartRepository.findOrCreate(userId);
    if (item.cartId !== cart.id) {
      throw Forbidden('Bu sepet kalemine erişim yetkiniz yok');
    }

    await cartRepository.deleteItem(itemId);
    return this.getCart(userId);
  },

  async clear(userId: string) {
    const cart = await cartRepository.findOrCreate(userId);
    await cartRepository.clearItems(cart.id);
    return this.getCart(userId);
  },
};
