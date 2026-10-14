import { Link } from 'react-router-dom';
import type { Product } from '../../../types/product';

// Ürünleri sonsuz kayan bir şerit halinde gösterir (CSS animasyonu)
export default function ProductMarquee({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  // Kesintisiz döngü için listeyi ikiye katla
  const doubled = [...products, ...products];

  return (
    <div className="relative overflow-hidden py-4">
      {/* Kenar geçiş efektleri */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-white to-transparent" />

      <div className="flex w-max animate-marquee gap-4 hover:[animation-play-state:paused]">
        {doubled.map((product, i) => {
          const img =
            product.images.find((im) => im.isPrimary) || product.images[0];
          return (
            <Link
              key={`${product.id}-${i}`}
              to={`/urun/${product.slug}`}
              className="w-40 flex-shrink-0"
            >
              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                {img && (
                  <img
                    src={img.url}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                )}
              </div>
              <p className="mt-2 truncate text-xs font-medium text-gray-700">
                {product.name}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
