import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productApi } from './productApi';
import ProductCard from './components/ProductCard';

export default function DiscountPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'discount-page'],
    queryFn: () => productApi.list({ onSale: true, limit: 24, sort: 'price-asc' }),
  });

  return (
    <div>
      {/* Başlık banner'ı */}
      <div className="bg-gradient-to-r from-rose-500 via-red-500 to-orange-400 py-14 text-center text-white">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-block text-5xl"
        >
          🔥
        </motion.span>
        <h1 className="mt-3 text-4xl font-extrabold">İndirim Köşesi</h1>
        <p className="mt-2 text-white/90">Kaçırılmayacak fırsatlar burada</p>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {isLoading && <p className="text-gray-500">Yükleniyor...</p>}
        {data && data.products.length === 0 && (
          <p className="text-center text-gray-500">Şu an indirimde ürün yok.</p>
        )}
        {data && data.products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {data.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
