export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string };
  userId?: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}
