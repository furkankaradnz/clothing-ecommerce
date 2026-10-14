import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    title: 'Yeni Sezon Koleksiyonu',
    subtitle: 'Sonbahar-kış parçaları burada. Tarzını yeniden keşfet.',
    cta: 'Keşfet',
    link: '/urunler',
    gradient: 'from-indigo-600 via-purple-600 to-pink-500',
    emoji: '🧥',
  },
  {
    title: 'Büyük İndirim Fırsatı',
    subtitle: "Seçili ürünlerde %40'a varan indirimler. Kaçırma!",
    cta: 'İndirimleri Gör',
    link: '/indirim',
    gradient: 'from-rose-500 via-red-500 to-orange-400',
    emoji: '🔥',
  },
  {
    title: 'Ayakkabıda Şıklık',
    subtitle: 'Spor ve klasik modeller tek çatı altında.',
    cta: 'Ayakkabılar',
    link: '/kategori/ayakkabi',
    gradient: 'from-teal-500 via-cyan-500 to-blue-500',
    emoji: '👟',
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[index];

  return (
    <section className="relative h-[420px] overflow-hidden sm:h-[480px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.7 }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
        >
          <div className="mx-auto flex h-full max-w-7xl flex-col items-start justify-center px-6 sm:px-10">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl sm:text-7xl"
            >
              {slide.emoji}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-6xl"
            >
              {slide.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3 max-w-xl text-base text-white/90 sm:text-lg"
            >
              {slide.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to={slide.link}
                className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm font-bold text-gray-900 shadow-lg transition-transform hover:scale-105"
              >
                {slide.cta}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Nokta göstergeleri */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'
            }`}
            aria-label={`Slayt ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
