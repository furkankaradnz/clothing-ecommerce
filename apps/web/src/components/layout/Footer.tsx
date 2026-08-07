import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Mağaza</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/kategori/kadin" className="hover:text-indigo-600">
                  Kadın
                </Link>
              </li>
              <li>
                <Link to="/kategori/erkek" className="hover:text-indigo-600">
                  Erkek
                </Link>
              </li>
              <li>
                <Link to="/kategori/cocuk" className="hover:text-indigo-600">
                  Çocuk
                </Link>
              </li>
              <li>
                <Link to="/urunler" className="hover:text-indigo-600">
                  Tüm Ürünler
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Yardım</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/kargo" className="hover:text-indigo-600">
                  Kargo & Teslimat
                </Link>
              </li>
              <li>
                <Link to="/iade" className="hover:text-indigo-600">
                  İade & Değişim
                </Link>
              </li>
              <li>
                <Link to="/sss" className="hover:text-indigo-600">
                  SSS
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Kurumsal</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/hakkimizda" className="hover:text-indigo-600">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="hover:text-indigo-600">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Takip Et</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600"
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} MODA. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
