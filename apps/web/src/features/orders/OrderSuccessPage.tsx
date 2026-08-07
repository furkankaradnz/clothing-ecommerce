import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from './orderApi';

function formatPrice(n: number) {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';
}

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderApi.getMine(id!),
    enabled: !!id,
  });

  if (isLoading)
    return <p className="mx-auto max-w-2xl px-4 py-12 text-gray-500">Yükleniyor...</p>;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <span className="text-3xl text-green-600">✓</span>
      </div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        Siparişiniz Alındı!
      </h1>
      <p className="mt-2 text-gray-600">
        Teşekkürler. Siparişiniz başarıyla oluşturuldu.
      </p>

      {order && (
        <div className="mt-8 rounded-lg border border-gray-200 p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Sipariş No</span>
            <span className="font-mono text-gray-900">
              {order.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Toplam</span>
            <span className="font-semibold text-gray-900">
              {formatPrice(Number(order.totalPrice))}
            </span>
          </div>
          <div className="mt-2 flex justify-between text-sm">
            <span className="text-gray-500">Teslimat</span>
            <span className="text-gray-900 text-right">
              {order.shippingAddress.district}/{order.shippingAddress.city}
            </span>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/siparislerim"
          className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Siparişlerim
        </Link>
        <Link
          to="/urunler"
          className="rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    </div>
  );
}
