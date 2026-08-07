import { Link, useNavigate } from 'react-router-dom';
import { useCart, useUpdateCartItem, useRemoveCartItem } from './useCart';
import { useAuthStore } from '../../store/authStore';

function formatPrice(n: number) {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';
}

export default function CartPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sepetim</h1>
        <p className="mt-4 text-gray-600">
          Sepetinizi görmek için giriş yapmalısınız.
        </p>
        <Link
          to="/giris"
          className="mt-6 inline-block rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Giriş Yap
        </Link>
      </div>
    );
  }

  if (isLoading)
    return <p className="mx-auto max-w-7xl px-4 py-12 text-gray-500">Yükleniyor...</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sepetim</h1>
        <p className="mt-4 text-gray-600">Sepetiniz boş.</p>
        <Link
          to="/urunler"
          className="mt-6 inline-block rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sepetim</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-lg border border-gray-200 p-4"
          >
            {/* Görsel */}
            <div className="h-24 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100">
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">
                  Görsel
                </div>
              )}
            </div>

            {/* Bilgi */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link
                  to={`/urun/${item.product.slug}`}
                  className="font-medium text-gray-900 hover:text-indigo-600"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-gray-500">
                  {item.variant.size} / {item.variant.color}
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  {formatPrice(item.unitPrice)}
                </p>
              </div>

              {/* Adet kontrolü + kaldır */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateItem.mutate({
                        itemId: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                    disabled={item.quantity <= 1 || updateItem.isPending}
                    className="h-8 w-8 rounded border border-gray-300 disabled:opacity-40"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateItem.mutate({
                        itemId: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                    disabled={
                      item.quantity >= item.variant.stock || updateItem.isPending
                    }
                    className="h-8 w-8 rounded border border-gray-300 disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem.mutate(item.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Kaldır
                </button>
              </div>
            </div>

            {/* Satır toplamı */}
            <div className="flex-shrink-0 text-right font-semibold text-gray-900">
              {formatPrice(item.lineTotal)}
            </div>
          </div>
        ))}
      </div>

      {/* Özet */}
      <div className="mt-8 rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Toplam</span>
          <span>{formatPrice(cart.total)}</span>
        </div>
        <button
          onClick={() => navigate('/odeme')}
          className="mt-4 w-full rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Ödemeye Geç
        </button>
        <p className="mt-2 text-center text-xs text-gray-400">
          (Ödeme akışı Hafta 6'da eklenecek)
        </p>
      </div>
    </div>
  );
}
