import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from './productApi';
import ProductCard from './components/ProductCard';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productApi.categories,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', 'category', slug],
    queryFn: () => productApi.list({ category: slug, limit: 24 }),
    enabled: !!slug,
  });

  // Bu üst kategorinin alt kategorileri
  const currentCategory = categories?.find((c) => c.slug === slug);
  const subCategories = categories?.filter(
    (c) => (c as any).parentId === currentCategory?.id
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
        {currentCategory?.name || slug}
      </h1>

      {/* Alt kategori linkleri */}
      {subCategories && subCategories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {subCategories.map((sub) => (
            <Link
              key={sub.id}
              to={`/urunler?category=${sub.slug}`}
              className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:border-indigo-400 hover:text-indigo-600"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {isLoading && <p className="text-gray-500">Yükleniyor...</p>}

      {data && data.products.length === 0 && (
        <p className="text-gray-500">Bu kategoride ürün bulunamadı.</p>
      )}

      {data && data.products.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {data.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
