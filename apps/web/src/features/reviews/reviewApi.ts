import { api } from '../../lib/api';
import type { ReviewsResponse, Review } from '../../types/review';

export const reviewApi = {
  listForProduct: async (productId: string): Promise<ReviewsResponse> => {
    const { data } = await api.get(`/reviews/product/${productId}`);
    return {
      reviews: data.reviews,
      averageRating: data.averageRating,
      reviewCount: data.reviewCount,
    };
  },
  create: async (
    productId: string,
    rating: number,
    comment: string
  ): Promise<Review> => {
    const { data } = await api.post(`/reviews/product/${productId}`, {
      rating,
      comment: comment || undefined,
    });
    return data.data;
  },
  remove: async (reviewId: string): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },
};
