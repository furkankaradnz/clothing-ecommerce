import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productApi } from './productApi';
import ProductCard from './components/ProductCard';
import HeroCarousel from '../home/components/HeroCarousel';
import ProductMarquee from '../home/components/ProductMarquee';

// Kategori kartları - DiceBear karakterli, canlı ve eşsiz
const categoryCards = [
  { name: 'Kadın', slug: 'kadin', bg: '1e1b4b', char: 'lorelei', seed: 'kadin-moda', accent: 'from-fuchsia-500/30' },
  { name: 'Erkek', slug: 'erkek', bg: '0c4a6e', char: 'notionists', seed: 'erkek-stil', accent: 'from-sky-500/30' },
  { name: 'Çocuk', slug: 'cocuk', bg: '713f12', char: 'big-smile', seed: 'cocuk-nese', accent: 'from-amber-500/30' },
  { name: 'Ayakkabı', slug: 'ayakkabi', bg: '064e3b', char: 'adventurer', seed: 'ayakkabi-spor', accent: 'from-emerald-500/30' },
  { name: 'Aksesuar', slug: 'aksesuar', bg: '4a044e', char: 'personas', seed: 'aksesuar-sik', accent: 'from-purple-500/30' },
];

function charUrl(style: string, seed: string, bg: string) {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=${bg}`;
}

export default function HomePage() {
  const {
    data: featured,
    isLoading: isFeaturedLoading,
    isError: isFeaturedError,
  } = useQuery({
    queryKey: ['products', 'featured-home'],
    queryFn: () => productApi.list({ featured: true, limit: 8 }),
  });
  const { data: sale } = useQuery({
    queryKey: ['products', 'sale-home'],
    queryFn: () => productApi.list({ onSale: true, limit: 4, sort: 'price-asc' }),
  });
  const { data: newest } = useQuery({
    queryKey: ['products', 'newest-home'],
    queryFn: () => productApi.list({ limit: 12 }),
  });

  return (
    <div>
      <HeroCarousel />

      {/* Kategori vitrini */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Kategoriler</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categoryCards.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.04, y: -4 }}
            >
              <Link
                to={`/kategori/${cat.slug}`}
                className="group relative flex aspect-[4/5] flex-col items-center justify-end overflow-hidden rounded-2xl shadow-lg"
                style={{ backgroundColor: `#${cat.bg}` }}
              >
                <img
                  src={charUrl(cat.char, cat.seed, cat.bg)}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.accent} via-transparent to-transparent`} />
                <span className="relative z-10 w-full bg-gradient-to-t from-black/70 to-transparent pb-3 pt-8 text-center text-lg font-bold text-white">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sonsuz ürün şeridi */}
      {newest && newest.products.length > 0 && (
        <section className="bg-gradient-to-r from-indigo-50 to-purple-50 py-8">
          <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
            Kıyafet Sonsuzluğu
          </h2>
          <p className="mb-4 text-center text-sm text-gray-500">
            Yüzlerce parça arasında kaybol
          </p>
          <ProductMarquee products={newest.products} />
        </section>
      )}

      {/* İndirim köşesi */}
      {sale && sale.products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="animate-float text-3xl">🔥</span>
              <h2 className="text-2xl font-bold text-gray-900">İndirim Köşesi</h2>
            </div>
            <Link to="/indirim" className="text-sm font-medium text-rose-600 hover:underline">
              Tümünü gör →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {sale.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Kampanya banner'ı */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-wide">Kampanya</p>
              <h3 className="mt-1 text-2xl font-bold">2 Al 1 Öde</h3>
              <p className="mt-1 text-sm text-white/80">Seçili tişörtlerde</p>
              <Link to="/kategori/kadin" className="mt-3 inline-block rounded-full bg-white px-5 py-2 text-xs font-bold text-indigo-600">
                Alışverişe Başla
              </Link>
            </div>
            <span className="text-6xl">👕</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 p-8 text-white"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-wide">Ücretsiz Kargo</p>
              <h3 className="mt-1 text-2xl font-bold">500₺ Üzeri</h3>
              <p className="mt-1 text-sm text-white/80">Tüm siparişlerde</p>
              <Link to="/urunler" className="mt-3 inline-block rounded-full bg-white px-5 py-2 text-xs font-bold text-rose-600">
                Keşfet
              </Link>
            </div>
            <span className="text-6xl">🚚</span>
          </motion.div>
        </div>
      </section>

      {/* Öne çıkanlar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            <h2 className="text-2xl font-bold text-gray-900">Öne Çıkanlar</h2>
          </div>
          <Link to="/urunler" className="text-sm font-medium text-indigo-600 hover:underline">
            Tümünü gör →
          </Link>
        </div>
        {isFeaturedLoading ? (
          <p className="text-gray-500">Urunler yukleniyor...</p>
        ) : isFeaturedError ? (
          <p className="text-red-600">Urunler su an yuklenemiyor. Lutfen tekrar deneyin.</p>
        ) : featured && featured.products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {featured.products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Henüz ürün yok. Seed verisini yüklediniz mi?</p>
        )}
      </section>
    </div>
  );
}
