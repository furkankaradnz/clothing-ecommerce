import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from './productApi';
import { useAddToCart } from '../cart/useCart';
import { useAuthStore } from '../../store/authStore';
import ProductReviews from '../reviews/ProductReviews';
import type { Variant } from '../../types/product';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const addToCart = useAddToCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [activeTab, setActiveTab] = useState<'desc' | 'details' | 'shipping'>('desc');

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getBySlug(slug!),
    enabled: !!slug,
  });

  if (isLoading)
    return <p className="mx-auto max-w-7xl px-4 py-12 text-gray-500">Yükleniyor...</p>;
  if (isError || !product)
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-red-600">Ürün bulunamadı.</p>
        <Link to="/urunler" className="text-indigo-600 hover:underline">
          ← Ürünlere dön
        </Link>
      </div>
    );

  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const colors = [...new Set(product.variants.map((v) => v.color))];

  // Seçilen beden+renk kombinasyonuna karşılık gelen varyant
  const selectedVariant: Variant | null =
    selectedSize && selectedColor
      ? product.variants.find(
          (v) => v.size === selectedSize && v.color === selectedColor
        ) || null
      : null;

  const price = Number(product.basePrice).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
  });

  const handleAddToCart = () => {
    if (!user) {
      navigate('/giris');
      return;
    }
    if (!selectedVariant) return;
    setFeedback('');
    addToCart.mutate(
      { variantId: selectedVariant.id, quantity: 1 },
      {
        onSuccess: () => setFeedback('Ürün sepete eklendi ✓'),
        onError: (err: any) =>
          setFeedback(err.response?.data?.message || 'Bir hata oluştu'),
      }
    );
  };

  // Bir bedenin herhangi bir renkte stoğu var mı (buton disable için)
  const sizeHasStock = (size: string) =>
    product.variants.some((v) => v.size === size && v.stock > 0);
  const colorHasStock = (color: string) =>
    product.variants.some((v) => v.color === color && v.stock > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-indigo-600">
          Ana Sayfa
        </Link>
        <span className="mx-2">/</span>
        <Link to="/urunler" className="hover:text-indigo-600">
          Ürünler
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.category.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Görsel galerisi */}
        <div>
          <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
            {product.images[activeImage] ? (
              <img
                src={product.images[activeImage].url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                Görsel yok
              </div>
            )}
          </div>
          {/* Küçük görseller */}
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`h-20 w-16 overflow-hidden rounded border-2 ${
                    activeImage === i ? 'border-indigo-600' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Bilgi */}
        <div>
          {product.brand && (
            <p className="text-sm font-medium text-indigo-600">{product.brand}</p>
          )}
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            {product.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{product.category.name}</p>

          <p className="mt-4 text-3xl font-bold text-gray-900">{price} ₺</p>

          {/* Renk seçimi */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">
              Renk: <span className="text-gray-500">{selectedColor || 'Seçiniz'}</span>
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  disabled={!colorHasStock(color)}
                  className={`rounded-md border px-4 py-2 text-sm ${
                    selectedColor === color
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  } ${!colorHasStock(color) ? 'opacity-40 line-through' : ''}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Beden seçimi */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-900">
              Beden: <span className="text-gray-500">{selectedSize || 'Seçiniz'}</span>
            </h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!sizeHasStock(size)}
                  className={`min-w-12 rounded-md border px-4 py-2 text-sm ${
                    selectedSize === size
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  } ${!sizeHasStock(size) ? 'opacity-40 line-through' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stok durumu + sepete ekle */}
          <div className="mt-6">
            {selectedVariant ? (
              selectedVariant.stock > 0 ? (
                <p className="text-sm text-green-600">
                  ✓ Stokta ({selectedVariant.stock} adet)
                </p>
              ) : (
                <p className="text-sm text-red-600">Bu kombinasyon tükendi</p>
              )
            ) : (
              <p className="text-sm text-gray-500">Renk ve beden seçin</p>
            )}

            <button
              onClick={handleAddToCart}
              disabled={
                !selectedVariant ||
                selectedVariant.stock === 0 ||
                addToCart.isPending
              }
              className="mt-3 w-full rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
            >
              {addToCart.isPending ? 'Ekleniyor...' : 'Sepete Ekle'}
            </button>
            {feedback && (
              <p
                className={`mt-2 text-sm ${
                  feedback.includes('✓') ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {feedback}
              </p>
            )}
          </div>

          {/* Kısa bilgi kutuları */}
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
            <div className="rounded-lg bg-gray-50 p-3">
              🚚<br />500₺ üzeri<br />ücretsiz kargo
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              ↩️<br />14 gün<br />iade
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              🔒<br />Güvenli<br />ödeme
            </div>
          </div>
        </div>
      </div>

      {/* Bilgi sekmeleri */}
      <div className="mt-12">
        <div className="flex gap-6 border-b border-gray-200">
          {[
            { key: 'desc', label: 'Açıklama' },
            { key: 'details', label: 'Ürün Detayları' },
            { key: 'shipping', label: 'Kargo & İade' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`pb-3 text-sm font-medium ${
                activeTab === tab.key
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 text-sm text-gray-600 leading-relaxed">
          {activeTab === 'desc' && <p>{product.description}</p>}

          {activeTab === 'details' && (
            <ul className="space-y-2">
              {product.brand && (
                <li>
                  <span className="font-medium text-gray-900">Marka:</span>{' '}
                  {product.brand}
                </li>
              )}
              {product.material && (
                <li>
                  <span className="font-medium text-gray-900">Malzeme:</span>{' '}
                  {product.material}
                </li>
              )}
              {product.careInfo && (
                <li>
                  <span className="font-medium text-gray-900">Yıkama:</span>{' '}
                  {product.careInfo}
                </li>
              )}
              <li>
                <span className="font-medium text-gray-900">
                  Mevcut renkler:
                </span>{' '}
                {colors.join(', ')}
              </li>
              <li>
                <span className="font-medium text-gray-900">
                  Mevcut bedenler:
                </span>{' '}
                {sizes.join(', ')}
              </li>
            </ul>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-2">
              <p>
                Siparişiniz 1-3 iş günü içinde kargoya verilir. 500 TL üzeri
                alışverişlerde kargo ücretsizdir.
              </p>
              <p>
                Ürünü teslim aldıktan sonra 14 gün içinde iade edebilirsiniz.
                Detaylar için <Link to="/iade" className="text-indigo-600 hover:underline">İade & Değişim</Link> sayfamıza bakın.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Yorumlar */}
      <ProductReviews productId={product.id} />
    </div>
  );
}
