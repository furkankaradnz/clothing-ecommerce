export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Mağaza</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>Kadın</li>
              <li>Erkek</li>
              <li>Çocuk</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Yardım</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>Kargo & Teslimat</li>
              <li>İade & Değişim</li>
              <li>SSS</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Kurumsal</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>Hakkımızda</li>
              <li>İletişim</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Takip Et</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>Instagram</li>
              <li>Twitter</li>
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
