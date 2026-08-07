import { prisma } from '../../config/prisma';
import { orderRepository } from './order.repository';
import { CreateOrderInput } from './order.schema';
import { OrderStatus } from '@prisma/client';
import {
  NotFound,
  BadRequest,
  Forbidden,
} from '../../common/errors/AppError';

// Kart numarasını maskele: sadece son 4 hane saklanır (güvenlik)
function maskCard(cardNumber: string) {
  return '**** **** **** ' + cardNumber.slice(-4);
}

export const orderService = {
  // SİPARİŞ OLUŞTURMA - projenin en kritik işlemi.
  // Tüm adımlar tek transaction'da: ya hepsi olur ya hiçbiri.
  async create(userId: string, input: CreateOrderInput) {
    // 1. Adres kontrolü (transaction dışında, hızlı fail)
    const address = await orderRepository.findAddress(input.addressId);
    if (!address) throw NotFound('Teslimat adresi bulunamadı');
    if (address.userId !== userId) {
      throw Forbidden('Bu adres size ait değil');
    }

    // 2. Sepeti al
    const cart = await orderRepository.findCartWithItems(userId);
    if (!cart || cart.items.length === 0) {
      throw BadRequest('Sepetiniz boş');
    }

    // 3. TRANSACTION: stok kontrolü + düşme + sipariş + kalemler + ödeme + sepet temizleme
    const order = await prisma.$transaction(async (tx) => {
      let totalPrice = 0;
      const orderItemsData = [];

      for (const item of cart.items) {
        // Stoğu transaction İÇİNDE tekrar oku (race condition'a karşı en güncel değer)
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
        });

        if (!variant) {
          throw NotFound(`Varyant bulunamadı: ${item.variantId}`);
        }

        // Kritik kontrol: transaction anında stok hâlâ yeterli mi?
        if (variant.stock < item.quantity) {
          throw BadRequest(
            `"${item.variant.product.name}" için yetersiz stok. ` +
              `İstenen: ${item.quantity}, mevcut: ${variant.stock}`
          );
        }

        // Stoğu düş
        await tx.productVariant.update({
          where: { id: variant.id },
          data: { stock: variant.stock - item.quantity },
        });

        // Fiyatı sipariş anında hesapla ve KOPYALA
        const unitPrice =
          Number(item.variant.product.basePrice) + Number(variant.priceDiff);
        totalPrice += unitPrice * item.quantity;

        orderItemsData.push({
          variantId: variant.id,
          productName: item.variant.product.name, // ürün adı kopyalanır
          unitPrice, // fiyat kopyalanır (ürün sonradan değişse bile korunur)
          quantity: item.quantity,
        });
      }

      // Siparişi oluştur (adres snapshot'ı JSON olarak saklanır)
      const created = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PAID, // sahte ödeme başarılı sayılır
          totalPrice,
          shippingAddress: {
            fullName: address.fullName,
            phone: address.phone,
            city: address.city,
            district: address.district,
            fullAddress: address.fullAddress,
            zipCode: address.zipCode,
          },
          items: { create: orderItemsData },
          payment: {
            create: {
              amount: totalPrice,
              method: 'credit_card',
              status: 'COMPLETED', // sahte - gerçek çekim yok
            },
          },
        },
      });

      // Sepeti boşalt
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    // Tam detayı döndür
    return orderRepository.findById(order.id);
  },

  async listMyOrders(userId: string) {
    return orderRepository.findByUser(userId);
  },

  async getMyOrder(userId: string, orderId: string) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw NotFound('Sipariş bulunamadı');
    if (order.userId !== userId) {
      throw Forbidden('Bu siparişe erişim yetkiniz yok');
    }
    return order;
  },

  // --- Admin işlemleri ---
  async listAll() {
    return orderRepository.findAll();
  },

  async updateStatus(orderId: string, status: OrderStatus) {
    const order = await orderRepository.findById(orderId);
    if (!order) throw NotFound('Sipariş bulunamadı');
    return orderRepository.updateStatus(orderId, status);
  },
};
