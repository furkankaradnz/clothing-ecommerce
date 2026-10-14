import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useCart } from '../../features/cart/useCart';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { data: cart } = useCart();
  const cartCount = cart?.itemCount || 0;

  const navLinks = [
    { label: 'Kadın', to: '/kategori/kadin' },
    { label: 'Erkek', to: '/kategori/erkek' },
    { label: 'Çocuk', to: '/kategori/cocuk' },
    { label: 'Ayakkabı', to: '/kategori/ayakkabi' },
    { label: 'Aksesuar', to: '/kategori/aksesuar' },
    { label: '🔥 İndirim', to: '/indirim' },
    { label: 'Tüm Ürünler', to: '/urunler' },
  ];

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            MODA<span className="text-indigo-600">.</span>
          </Link>

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

          <div className="flex items-center gap-4">
            <Link
              to="/sepet"
              className="relative hidden sm:inline text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Sepet
              {cartCount > 0 && (
                <span className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  to="/siparislerim"
                  className="hidden sm:inline text-sm text-gray-700 hover:text-indigo-600"
                >
                  Siparişlerim
                </Link>
                {user.role === 'ADMIN' && (
                  <>
                    <Link
                      to="/admin"
                      className="hidden sm:inline text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Panel
                    </Link>
                    <Link
                      to="/admin/urunler"
                      className="hidden sm:inline text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Ürünler
                    </Link>
                    <Link
                      to="/admin/siparisler"
                      className="hidden sm:inline text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Siparişler
                    </Link>
                  </>
                )}
                <Link
                  to="/hesap/adresler"
                  className="hidden sm:inline text-sm text-gray-600 hover:text-indigo-600"
                >
                  Merhaba, {user.firstName}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden sm:inline text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <Link
                to="/giris"
                className="hidden sm:inline text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Giriş
              </Link>
            )}

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
            <Link
              to="/sepet"
              onClick={() => setMobileOpen(false)}
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Sepet
            </Link>
            {user ? (
              <>
                <Link
                  to="/siparislerim"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Siparişlerim
                </Link>
                <Link
                  to="/hesap/adresler"
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Adreslerim
                </Link>
                {user.role === 'ADMIN' && (
                  <>
                    <Link
                      to="/admin/urunler"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-3 py-2 text-base font-medium text-indigo-600 hover:bg-gray-100"
                    >
                      Admin — Ürünler
                    </Link>
                    <Link
                      to="/admin/siparisler"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-md px-3 py-2 text-base font-medium text-indigo-600 hover:bg-gray-100"
                    >
                      Admin — Siparişler
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Çıkış ({user.firstName})
                </button>
              </>
            ) : (
              <Link
                to="/giris"
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Giriş
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
