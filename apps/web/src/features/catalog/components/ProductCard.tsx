import { Link } from 'react-router-dom';
import type { Product } from '../../../types/product';

export default function ProductCard({ product }: { product: Product }) {
  const primaryImage =
    product.images.find((img) => img.isPrimary) || product.images[0];
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const price = Number(product.basePrice).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
  });

  return (
    <Link to={`/urun/${product.slug}`} className="group cursor-pointer">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.altText || product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 text-sm">
            Görsel yok
          </div>
        )}
      </div>
      <h3 className="mt-3 text-sm font-medium text-gray-900 group-hover:text-indigo-600">
        {product.name}
      </h3>
      <p className="mt-1 text-sm font-semibold text-gray-700">{price} ₺</p>
      {totalStock === 0 && (
        <span className="mt-1 inline-block text-xs text-red-600">Tükendi</span>
      )}
    </Link>
  );
}
