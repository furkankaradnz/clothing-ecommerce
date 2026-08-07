import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewApi } from './reviewApi';
import StarRating from './StarRating';
import { useAuthStore } from '../../store/authStore';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function ProductReviews({ productId }: { productId: string }) {
  const qc = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewApi.listForProduct(productId),
  });

  const createReview = useMutation({
    mutationFn: () => reviewApi.create(productId, rating, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', productId] });
      setComment('');
      setRating(5);
      setShowForm(false);
      setError('');
    },
    onError: (err: any) =>
      setError(err.response?.data?.message || 'Yorum eklenemedi'),
  });

  const removeReview = useMutation({
    mutationFn: (id: string) => reviewApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', productId] }),
  });

  if (isLoading)
    return <p className="text-gray-500 mt-8">Yorumlar yükleniyor...</p>;

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Değerlendirmeler ({data?.reviewCount || 0})
        </h2>
        {data && data.reviewCount > 0 && (
          <div className="flex items-center gap-2">
            <StarRating rating={data.averageRating} />
            <span className="text-sm text-gray-600">
              {data.averageRating.toFixed(1)} / 5
            </span>
          </div>
        )}
      </div>

      {/* Yorum yap butonu / formu */}
      {user ? (
        <div className="mt-4">
          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-md border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Yorum Yap
            </button>
          ) : (
            <div className="rounded-lg border border-gray-200 p-4 space-y-3">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Puanınız
                </label>
                <StarRating rating={rating} onChange={setRating} size="lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yorumunuz (opsiyonel)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Ürün hakkında düşünceleriniz..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => createReview.mutate()}
                  disabled={createReview.isPending}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createReview.isPending ? 'Gönderiliyor...' : 'Gönder'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700"
                >
                  İptal
                </button>
              </div>
              <p className="text-xs text-gray-400">
                Not: Sadece satın aldığınız ürünlere yorum yapabilirsiniz.
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-gray-500">
          Yorum yapmak için giriş yapmalısınız.
        </p>
      )}

      {/* Yorum listesi */}
      <div className="mt-6 space-y-4">
        {data && data.reviews.length === 0 && (
          <p className="text-gray-500">Henüz yorum yok. İlk yorumu siz yapın!</p>
        )}
        {data?.reviews.map((review) => (
          <div key={review.id} className="rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <StarRating rating={review.rating} size="sm" />
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {review.user.firstName} {review.user.lastName.charAt(0)}.
                </p>
              </div>
              <span className="text-xs text-gray-400">
                {formatDate(review.createdAt)}
              </span>
            </div>
            {review.comment && (
              <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
            )}
            {/* Admin kendi yorumunu değil, herkesinkini silebilir */}
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => removeReview.mutate(review.id)}
                className="mt-2 text-xs text-red-600 hover:underline"
              >
                Sil (admin)
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
