import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productApi } from './productApi';
import ProductCard from './components/ProductCard';
import type { ProductFilters } from '../../types/product';

export default function CatalogPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    sort: 'newest',
  });
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productApi.list(filters),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productApi.categories,
  });

  const updateFilter = (patch: Partial<ProductFilters>) =>
    setFilters((f) => ({ ...f, ...patch, page: 1 }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tüm Ürünler</h1>

      {/* Filtre çubuğu - mobilde alt alta, masaüstünde yan yana */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && updateFilter({ search: searchInput })
          }
          placeholder="Ürün ara..."
          className="w-full sm:w-48 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />

        <select
          value={filters.category || ''}
          onChange={(e) => updateFilter({ category: e.target.value || undefined })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="">Tüm kategoriler</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filters.size || ''}
          onChange={(e) => updateFilter({ size: e.target.value || undefined })}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          <option value="">Tüm bedenler</option>
          {['S', 'M', 'L', 'XL'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) =>
            updateFilter({ sort: e.target.value as ProductFilters['sort'] })
          }
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none sm:ml-auto"
        >
          <option value="newest">En yeni</option>
          <option value="price-asc">Fiyat: Artan</option>
          <option value="price-desc">Fiyat: Azalan</option>
          <option value="name-asc">İsim: A-Z</option>
        </select>
      </div>

      {/* Sonuçlar */}
      {isLoading && <p className="text-gray-500">Yükleniyor...</p>}
      {isError && (
        <p className="text-red-600">
          Ürünler yüklenemedi. Backend çalışıyor mu?
        </p>
      )}

      {data && data.products.length === 0 && (
        <p className="text-gray-500">Filtrelere uygun ürün bulunamadı.</p>
      )}

      {data && data.products.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Sayfalama */}
          {data.pagination.totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={filters.page === 1}
                onClick={() =>
                  setFilters((f) => ({ ...f, page: (f.page || 1) - 1 }))
                }
                className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-40"
              >
                Önceki
              </button>
              <span className="text-sm text-gray-600">
                {data.pagination.page} / {data.pagination.totalPages}
              </span>
              <button
                disabled={filters.page === data.pagination.totalPages}
                onClick={() =>
                  setFilters((f) => ({ ...f, page: (f.page || 1) + 1 }))
                }
                className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-40"
              >
                Sonraki
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
