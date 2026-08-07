import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from './productApi';
import ProductCard from './components/ProductCard';

const categoryCards = [
  { name: 'Kadın', slug: 'kadin', color: 'bg-pink-100 text-pink-700' },
  { name: 'Erkek', slug: 'erkek', color: 'bg-blue-100 text-blue-700' },
  { name: 'Çocuk', slug: 'cocuk', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Ayakkabı', slug: 'ayakkabi', color: 'bg-green-100 text-green-700' },
  { name: 'Aksesuar', slug: 'aksesuar', color: 'bg-purple-100 text-purple-700' },
];

export default function HomePage() {
  const { data } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productApi.list({ limit: 8 }),
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Yeni Sezon Burada
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            En yeni koleksiyonu keşfet, tarzını yansıt.
          </p>
          <Link
            to="/urunler"
            className="mt-8 inline-block rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Alışverişe Başla
          </Link>
        </div>
      </section>

      {/* Kategori vitrini */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Kategoriler</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categoryCards.map((cat) => (
            <Link
              key={cat.slug}
              to={`/kategori/${cat.slug}`}
              className={`flex aspect-square items-center justify-center rounded-xl ${cat.color} text-lg font-semibold hover:opacity-80 transition-opacity`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Öne çıkanlar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Öne Çıkanlar</h2>
          <Link to="/urunler" className="text-sm font-medium text-indigo-600 hover:underline">
            Tümünü gör →
          </Link>
        </div>

        {data && data.products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            Henüz ürün yok. Backend'i çalıştırıp seed verisini eklediniz mi?
          </p>
        )}
      </section>
    </div>
  );
}
