import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { adminApi } from './adminApi';
import { formatPrice } from '../../lib/format';

const statusLabels: Record<string, string> = {
  PENDING: 'Beklemede', PAID: 'Ödendi', SHIPPED: 'Kargoda',
  DELIVERED: 'Teslim', CANCELLED: 'İptal',
};

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.stats,
  });

  if (isLoading)
    return <p className="mx-auto max-w-6xl px-4 py-12 text-gray-500">Yükleniyor...</p>;
  if (!stats) return null;

  const cards = [
    { label: 'Toplam Ciro', value: formatPrice(stats.totals.revenue), gradient: 'from-emerald-400 to-teal-500', emoji: '💰' },
    { label: 'Sipariş', value: stats.totals.orders, gradient: 'from-blue-400 to-indigo-500', emoji: '📦' },
    { label: 'Ürün', value: stats.totals.products, gradient: 'from-violet-400 to-purple-500', emoji: '👕' },
    { label: 'Kullanıcı', value: stats.totals.users, gradient: 'from-pink-400 to-rose-500', emoji: '👥' },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Yönetim Paneli</h1>
        <div className="flex gap-2">
          <Link to="/admin/urunler" className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Ürünler
          </Link>
          <Link to="/admin/siparisler" className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Siparişler
          </Link>
        </div>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl bg-gradient-to-br ${c.gradient} p-5 text-white shadow-md`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{c.emoji}</span>
            </div>
            <p className="mt-3 text-2xl font-bold">{c.value}</p>
            <p className="text-sm text-white/80">{c.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sipariş durumu dağılımı */}
        <div className="rounded-2xl border border-gray-200 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Sipariş Durumları
          </h2>
          {stats.ordersByStatus.length === 0 ? (
            <p className="text-sm text-gray-500">Henüz sipariş yok.</p>
          ) : (
            <div className="space-y-3">
              {stats.ordersByStatus.map((s) => (
                <div key={s.status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {statusLabels[s.status] || s.status}
                  </span>
                  <span className="rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-700">
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Düşük stok uyarısı */}
        <div className="rounded-2xl border border-gray-200 p-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            ⚠️ Stoğu Azalan Ürünler
          </h2>
          {stats.lowStock.length === 0 ? (
            <p className="text-sm text-gray-500">Stok seviyeleri iyi durumda.</p>
          ) : (
            <div className="space-y-2">
              {stats.lowStock.map((v) => (
                <div key={v.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">
                    {v.product}{' '}
                    <span className="text-gray-400">
                      ({v.size}/{v.color})
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      v.stock === 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {v.stock} adet
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Kullanıcılar */}
      <UsersTable />
    </div>
  );
}

function UsersTable() {
  const { data: users } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminApi.users,
  });

  if (!users || users.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Kullanıcılar</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-gray-500">
              <th className="py-2 pr-4">Ad</th>
              <th className="py-2 pr-4">E-posta</th>
              <th className="py-2 pr-4">Rol</th>
              <th className="py-2">Sipariş</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100">
                <td className="py-2 pr-4 font-medium text-gray-900">
                  {u.firstName} {u.lastName}
                </td>
                <td className="py-2 pr-4 text-gray-600">{u.email}</td>
                <td className="py-2 pr-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="py-2 text-gray-600">{u._count.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
