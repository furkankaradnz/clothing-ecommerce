import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productApi } from './productApi';
import ProductCard from './components/ProductCard';
import type { ProductFilters } from '../../types/product';
import { formatPrice } from '../../lib/format';

const SORT_OPTIONS = [
  { value: 'newest', label: 'En Yeni' },
  { value: 'price-asc', label: 'Fiyat: Artan' },
  { value: 'price-desc', label: 'Fiyat: Azalan' },
  { value: 'name-asc', label: 'İsim: A-Z' },
] as const;

// Grid sütun seçenekleri (ekran boyutu ayarı)
const GRID_OPTIONS = [
  { cols: 2, label: '2', cls: 'grid-cols-2' },
  { cols: 3, label: '3', cls: 'grid-cols-2 sm:grid-cols-3' },
  { cols: 4, label: '4', cls: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' },
  { cols: 5, label: '5', cls: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' },
];

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') || undefined;

  // Filtre durumu
  const [search, setSearch] = useState('');
  const [style, setStyle] = useState<string>('');
  const [fit, setFit] = useState<string>('');
  const [size, setSize] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [sort, setSort] = useState<ProductFilters['sort']>('newest');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [gridCols, setGridCols] = useState(4);
  const [showFilters, setShowFilters] = useState(false);

  // Filtre seçeneklerini çek
  const { data: options } = useQuery({
    queryKey: ['filterOptions'],
    queryFn: productApi.filterOptions,
  });

  const priceMin = options?.priceRange.min ?? 0;
  const priceMax = options?.priceRange.max ?? 2000;
  const currentMax = maxPrice ?? priceMax;

  const filters: ProductFilters = useMemo(
    () => ({
      category: categoryFromUrl,
      search: search || undefined,
      style: style || undefined,
      fit: fit || undefined,
      size: size || undefined,
      color: color || undefined,
      maxPrice: maxPrice ?? undefined,
      sort,
      limit: 48,
    }),
    [categoryFromUrl, search, style, fit, size, color, maxPrice, sort]
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', 'catalog', filters],
    queryFn: () => productApi.list(filters),
    placeholderData: keepPreviousData,
  });

  const activeCount = [search, style, fit, size, color, maxPrice].filter(Boolean).length;

  const clearAll = () => {
    setSearch(''); setStyle(''); setFit(''); setSize(''); setColor(''); setMaxPrice(null);
  };

  const gridCls = GRID_OPTIONS.find((g) => g.cols === gridCols)?.cls || GRID_OPTIONS[2].cls;

  // Filtre paneli içeriği (hem masaüstü hem mobil için)
  const FilterPanel = (
    <div className="space-y-6">
      {/* Fiyat aralığı barı */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-900">Fiyat Aralığı</h3>
        <input
          type="range"
          min={priceMin}
          max={priceMax}
          value={currentMax}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>{formatPrice(priceMin)}</span>
          <span className="font-medium text-indigo-600">≤ {formatPrice(currentMax)}</span>
        </div>
      </div>

      {/* Tarz */}
      {options && options.styles.length > 0 && (
        <FilterGroup
          title="Tarz"
          values={options.styles}
          selected={style}
          onSelect={(v) => setStyle(style === v ? '' : v)}
        />
      )}

      {/* Kesim */}
      {options && options.fits.length > 0 && (
        <FilterGroup
          title="Kesim"
          values={options.fits}
          selected={fit}
          onSelect={(v) => setFit(fit === v ? '' : v)}
        />
      )}

      {/* Beden */}
      {options && options.sizes.length > 0 && (
        <FilterGroup
          title="Beden"
          values={options.sizes}
          selected={size}
          onSelect={(v) => setSize(size === v ? '' : v)}
          pill
        />
      )}

      {/* Renk */}
      {options && options.colors.length > 0 && (
        <FilterGroup
          title="Renk"
          values={options.colors}
          selected={color}
          onSelect={(v) => setColor(color === v ? '' : v)}
        />
      )}

      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="w-full rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Filtreleri Temizle ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {categoryFromUrl ? categoryFromUrl : 'Tüm Ürünler'}
      </h1>

      {/* Arama bölümü - belirgin */}
      <div className="relative mt-4">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ürün, marka veya kategori ara..."
          className="w-full rounded-full border border-gray-300 py-3 pl-11 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {/* Üst kontrol çubuğu: sırala, grid boyutu, mobil filtre */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 lg:hidden"
        >
          ☰ Filtreler {activeCount > 0 && `(${activeCount})`}
        </button>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as ProductFilters['sort'])}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Grid boyutu ayarı */}
        <div className="ml-auto flex items-center gap-1">
          <span className="mr-1 hidden text-xs text-gray-500 sm:inline">Boyut:</span>
          {GRID_OPTIONS.map((g) => (
            <button
              key={g.cols}
              onClick={() => setGridCols(g.cols)}
              className={`hidden h-8 w-8 items-center justify-center rounded-md border text-sm sm:flex ${
                gridCols === g.cols
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                  : 'border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
              title={`${g.cols} sütun`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-6">
        {/* Masaüstü filtre kenar çubuğu */}
        <aside className="hidden w-56 flex-shrink-0 lg:block">
          {FilterPanel}
        </aside>

        {/* Mobil filtre paneli (açılır) */}
        {showFilters && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-80 max-w-full overflow-y-auto bg-white p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filtreler</h2>
                <button onClick={() => setShowFilters(false)} className="text-2xl leading-none text-gray-400">×</button>
              </div>
              {FilterPanel}
            </div>
          </div>
        )}

        {/* Ürün ızgarası */}
        <div className="flex-1">
          {isLoading ? (
            <p className="text-gray-500">Yükleniyor...</p>
          ) : data && data.products.length > 0 ? (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {data.products.length} ürün {isFetching && '· güncelleniyor...'}
              </p>
              <div className={`grid ${gridCls} gap-4 sm:gap-6`}>
                {data.products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <p className="text-5xl">🔍</p>
              <p className="mt-3 text-gray-500">Aradığın kritere uygun ürün bulunamadı.</p>
              {activeCount > 0 && (
                <button onClick={clearAll} className="mt-3 text-sm font-medium text-indigo-600 hover:underline">
                  Filtreleri temizle
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Filtre grubu (tıklanabilir etiketler)
function FilterGroup({
  title, values, selected, onSelect, pill,
}: {
  title: string;
  values: string[];
  selected: string;
  onSelect: (v: string) => void;
  pill?: boolean;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-gray-900">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {values.map((v) => (
          <button
            key={v}
            onClick={() => onSelect(v)}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${
              selected === v
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-gray-300 text-gray-600 hover:border-indigo-400'
            } ${pill ? 'min-w-9 text-center' : ''}`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}
