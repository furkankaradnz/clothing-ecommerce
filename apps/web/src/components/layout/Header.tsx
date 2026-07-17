import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: 'Kadın', to: '/kategori/kadin' },
    { label: 'Erkek', to: '/kategori/erkek' },
    { label: 'Çocuk', to: '/kategori/cocuk' },
    { label: 'İndirim', to: '/indirim' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tight">
            MODA<span className="text-indigo-600">.</span>
          </Link>

          {/* Masaüstü menü */}
          <nav className="hidden md:flex md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Sağ ikonlar */}
          <div className="flex items-center gap-4">
            <Link to="/sepet" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
              Sepet
            </Link>
            <Link to="/giris" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
              Giriş
            </Link>

            {/* Mobil menü butonu */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
              aria-label="Menüyü aç/kapat"
            >
              <span className="block h-0.5 w-6 bg-current mb-1" />
              <span className="block h-0.5 w-6 bg-current mb-1" />
              <span className="block h-0.5 w-6 bg-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobil açılır menü */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
