import { reviewRepository } from './review.repository';
import { productRepository } from '../products/product.repository';
import { CreateReviewInput } from './review.schema';
import {
  NotFound,
  BadRequest,
  Forbidden,
  Conflict,
} from '../../common/errors/AppError';

export const reviewService = {
  // Ürünün yorumları + istatistikleri (herkese açık)
  async listForProduct(productId: string) {
    const [reviews, stats] = await Promise.all([
      reviewRepository.findByProduct(productId),
      reviewRepository.getStats(productId),
    ]);
    return { reviews, ...stats };
  },

  async create(productId: string, userId: string, input: CreateReviewInput) {
    // Ürün var mı?
    const product = await productRepository.findById(productId);
    if (!product) throw NotFound('Ürün bulunamadı');

    // Kural: sadece satın almış kullanıcılar yorum yapabilir
    const purchased = await reviewRepository.hasPurchased(productId, userId);
    if (!purchased) {
      throw Forbidden('Sadece satın aldığınız ürünlere yorum yapabilirsiniz');
    }

    // Kural: bir kullanıcı bir ürüne bir kez yorum yapabilir
    const existing = await reviewRepository.findByProductAndUser(
      productId,
      userId
    );
    if (existing) {
      throw Conflict('Bu ürüne zaten yorum yaptınız');
    }

    return reviewRepository.create(productId, userId, input);
  },

  async remove(reviewId: string, userId: string, userRole: string) {
    const review = await reviewRepository.findById(reviewId);
    if (!review) throw NotFound('Yorum bulunamadı');

    // Kendi yorumu ya da admin silebilir
    if (review.userId !== userId && userRole !== 'ADMIN') {
      throw Forbidden('Bu yorumu silme yetkiniz yok');
    }

    return reviewRepository.delete(reviewId);
  },
};
