import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from './orderApi';
import OrderStatusBadge from './OrderStatusBadge';

function formatPrice(n: number) {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function MyOrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: orderApi.listMine,
  });

  if (isLoading)
    return <p className="mx-auto max-w-4xl px-4 py-12 text-gray-500">Yükleniyor...</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Siparişlerim</h1>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Henüz siparişiniz yok.</p>
          <Link
            to="/urunler"
            className="mt-4 inline-block rounded-md bg-indigo-600 px-6 py-2 text-sm text-white"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <span className="font-mono text-sm text-gray-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="mt-3 space-y-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>
                      {item.productName} ({item.variant.size}/{item.variant.color})
                      x{item.quantity}
                    </span>
                    <span>
                      {formatPrice(Number(item.unitPrice) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 font-semibold">
                <span>Toplam</span>
                <span>{formatPrice(Number(order.totalPrice))}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
