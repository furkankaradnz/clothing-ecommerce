import type { OrderStatus } from '../../types/order';

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  PENDING: { label: 'Beklemede', className: 'bg-yellow-100 text-yellow-800' },
  PAID: { label: 'Ödendi', className: 'bg-blue-100 text-blue-800' },
  SHIPPED: { label: 'Kargoda', className: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Teslim Edildi', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'İptal', className: 'bg-red-100 text-red-800' },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
