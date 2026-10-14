import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminProductApi, VariantInput } from './adminProductApi';

function formatPrice(n: number) {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';
}

const emptyVariant: VariantInput = {
  size: '',
  color: '',
  sku: '',
  stock: 0,
  priceDiff: 0,
};

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  basePrice: 0,
  categoryId: '',
  images: ['', '', '', '', ''], // tam 5 görsel URL'i
  variants: [{ ...emptyVariant }],
};

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const { data: products, isLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: adminProductApi.list,
  });
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: adminProductApi.categories,
  });

  const createProduct = useMutation({
    mutationFn: () => adminProductApi.create(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminProducts'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      setForm(emptyForm);
      setShowForm(false);
      setError('');
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Ürün eklenemedi';
      setError(msg);
    },
  });

  const removeProduct = useMutation({
    mutationFn: (id: string) => adminProductApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['adminProducts'] });
      qc.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const updateField = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  const updateVariant = (
    index: number,
    field: keyof VariantInput,
    value: string | number
  ) =>
    setForm((f) => ({
      ...f,
      variants: f.variants.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));

  const addVariant = () =>
    setForm((f) => ({ ...f, variants: [...f.variants, { ...emptyVariant }] }));

  const removeVariant = (index: number) =>
    setForm((f) => ({
      ...f,
      variants: f.variants.filter((_, i) => i !== index),
    }));

  // Görsel URL'ini güncelle (5 sabit slot)
  const updateImage = (index: number, value: string) =>
    setForm((f) => ({
      ...f,
      images: f.images.map((img, i) => (i === index ? value : img)),
    }));

  const inputCls =
    'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none';

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {showForm ? 'İptal' : '+ Yeni Ürün'}
        </button>
      </div>

      {/* Yeni ürün formu */}
      {showForm && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6 space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Adı
              </label>
              <input
                className={inputCls}
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (url-uyumlu)
              </label>
              <input
                className={inputCls}
                placeholder="basic-tisort"
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temel Fiyat (₺)
              </label>
              <input
                type="number"
                className={inputCls}
                value={form.basePrice}
                onChange={(e) =>
                  updateField('basePrice', Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <select
                className={inputCls}
                value={form.categoryId}
                onChange={(e) => updateField('categoryId', e.target.value)}
              >
                <option value="">Seçin...</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              className={inputCls}
              rows={2}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </div>

          {/* Ürün görselleri - tam 5 zorunlu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ürün Görselleri (5 adet zorunlu)
            </label>
            <p className="mb-2 text-xs text-gray-500">
              Her ürün için tam 5 görsel URL'i girin. İlk görsel kapak (birincil)
              görseldir. Kıyafetin ön planda olduğu, ürünle örtüşen görseller önerilir.
            </p>
            <div className="space-y-2">
              {form.images.map((img, i) => (
                <div key={i} className="flex items-center gap-2">
                  {/* Önizleme */}
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
                    {img ? (
                      <img
                        src={img}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.opacity = '0.2';
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-300">
                        {i + 1}
                      </div>
                    )}
                  </div>
                  <input
                    className={inputCls}
                    placeholder={`Görsel ${i + 1} URL'i${i === 0 ? ' (kapak)' : ''}`}
                    value={img}
                    onChange={(e) => updateImage(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Varyantlar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Varyantlar (beden / renk / stok)
              </label>
              <button
                onClick={addVariant}
                className="text-sm text-indigo-600 hover:underline"
              >
                + Varyant ekle
              </button>
            </div>
            <div className="space-y-2">
              {form.variants.map((variant, index) => (
                <div key={index} className="flex flex-wrap gap-2 items-center">
                  <input
                    className={`${inputCls} flex-1 min-w-16`}
                    placeholder="Beden"
                    value={variant.size}
                    onChange={(e) => updateVariant(index, 'size', e.target.value)}
                  />
                  <input
                    className={`${inputCls} flex-1 min-w-16`}
                    placeholder="Renk"
                    value={variant.color}
                    onChange={(e) => updateVariant(index, 'color', e.target.value)}
                  />
                  <input
                    className={`${inputCls} flex-1 min-w-20`}
                    placeholder="SKU"
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                  />
                  <input
                    type="number"
                    className={`${inputCls} w-20`}
                    placeholder="Stok"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(index, 'stock', Number(e.target.value))
                    }
                  />
                  {form.variants.length > 1 && (
                    <button
                      onClick={() => removeVariant(index)}
                      className="text-red-600 px-2"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              // 5 görselin de dolu olduğunu kontrol et
              const filled = form.images.filter((u) => u.trim() !== '');
              if (filled.length !== 5) {
                setError('Tam olarak 5 görsel URL\'i girmelisiniz');
                return;
              }
              createProduct.mutate();
            }}
            disabled={createProduct.isPending}
            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {createProduct.isPending ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
          </button>
        </div>
      )}

      {/* Ürün listesi */}
      {isLoading ? (
        <p className="text-gray-500">Yükleniyor...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500">
                <th className="py-2 pr-4">Ürün</th>
                <th className="py-2 pr-4">Kategori</th>
                <th className="py-2 pr-4">Fiyat</th>
                <th className="py-2 pr-4">Varyant</th>
                <th className="py-2 pr-4">Toplam Stok</th>
                <th className="py-2">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => {
                const totalStock = product.variants.reduce(
                  (sum, v) => sum + v.stock,
                  0
                );
                return (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {product.category.name}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {formatPrice(Number(product.basePrice))}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">
                      {product.variants.length}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{totalStock}</td>
                    <td className="py-3">
                      <button
                        onClick={() => {
                          if (confirm(`"${product.name}" silinsin mi?`)) {
                            removeProduct.mutate(product.id);
                          }
                        }}
                        className="text-red-600 hover:underline"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
