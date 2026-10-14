import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductImage } from '../../../types/product';

// Kaydırmalı ürün galerisi: sürükle, ok butonları, thumbnail, nokta göstergesi
export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
        Görsel yok
      </div>
    );
  }

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + images.length) % images.length);
  };

  return (
    <div>
      {/* Ana görsel - kaydırmalı */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={index}
            src={images[index].url}
            alt=""
            custom={direction}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1);
              else if (info.offset.x > 60) go(index - 1);
            }}
            className="absolute inset-0 h-full w-full cursor-grab object-contain p-6 active:cursor-grabbing"
          />
        </AnimatePresence>

        {/* Ok butonları */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => go(index - 1)}
              className="absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
              aria-label="Önceki"
            >
              ‹
            </button>
            <button
              onClick={() => go(index + 1)}
              className="absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow hover:bg-white"
              aria-label="Sonraki"
            >
              ›
            </button>
          </>
        )}

        {/* Nokta göstergeleri */}
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-6 bg-indigo-600' : 'w-2 bg-gray-300'
              }`}
              aria-label={`Görsel ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail şeridi */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => go(i)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50 ${
                index === i ? 'border-indigo-600' : 'border-transparent'
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
