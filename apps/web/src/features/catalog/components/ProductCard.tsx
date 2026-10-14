import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Product } from '../../../types/product';
import { formatPrice, discountPercent } from '../../../lib/format';

export default function ProductCard({ product }: { product: Product }) {
  const primary = product.images.find((i) => i.isPrimary) || product.images[0];
  const secondary = product.images.find((i) => !i.isPrimary);
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);

  const hasDiscount = !!product.discountPrice;
  const pct = hasDiscount
    ? discountPercent(product.basePrice, product.discountPrice!)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link to={`/urun/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-100">
          {/* Rozetler */}
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {hasDiscount && (
              <span className="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow">
                %{pct} İNDİRİM
              </span>
            )}
            {product.isFeatured && (
              <span className="rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-900 shadow">
                ⭐ ÖNE ÇIKAN
              </span>
            )}
            {totalStock === 0 && (
              <span className="rounded-full bg-gray-800 px-2.5 py-1 text-xs font-bold text-white shadow">
                TÜKENDİ
              </span>
            )}
          </div>

          {/* Görsel - hover'da ikinciye geçiş */}
          {primary && (
            <img
              src={primary.url}
              alt={product.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
          )}
          {secondary && (
            <img
              src={secondary.url}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </div>

        <div className="mt-3">
          {product.brand && (
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
              {product.brand}
            </p>
          )}
          <h3 className="mt-0.5 text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-indigo-600">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-sm font-bold text-rose-600">
                  {formatPrice(product.discountPrice!)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.basePrice)}
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-gray-800">
                {formatPrice(product.basePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
