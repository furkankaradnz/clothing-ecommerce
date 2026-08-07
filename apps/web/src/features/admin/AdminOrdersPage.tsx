import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../orders/orderApi';
import OrderStatusBadge from '../orders/OrderStatusBadge';
import type { OrderStatus } from '../../types/order';

function formatPrice(n: number) {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR');
}

const statuses: OrderStatus[] = [
  'PENDING',
  'PAID',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export default function AdminOrdersPage() {
  const qc = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: orderApi.listAll,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['adminOrders'] }),
  });

  if (isLoading)
    return <p className="mx-auto max-w-6xl px-4 py-12 text-gray-500">Yükleniyor...</p>;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Sipariş Yönetimi (Admin)
      </h1>

      {!orders || orders.length === 0 ? (
        <p className="text-gray-600">Henüz sipariş yok.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-mono text-sm text-gray-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="ml-3 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </span>
                  {order.user && (
                    <p className="text-sm text-gray-600 mt-1">
                      {order.user.firstName} {order.user.lastName} —{' '}
                      {order.user.email}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus.mutate({
                        id: order.id,
                        status: e.target.value as OrderStatus,
                      })
                    }
                    disabled={updateStatus.isPending}
                    className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-gray-100 pt-3 text-sm">
                <span className="text-gray-600">
                  {order.items.length} kalem —{' '}
                  {order.shippingAddress.district}/{order.shippingAddress.city}
                </span>
                <span className="font-semibold">
                  {formatPrice(Number(order.totalPrice))}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
