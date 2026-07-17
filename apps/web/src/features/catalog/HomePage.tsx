// Örnek statik veri - hafta 3-4'te API'den gelecek
const sampleProducts = [
  { id: 1, name: 'Basic Pamuklu Tişört', price: '199,90 ₺' },
  { id: 2, name: 'Oversize Sweatshirt', price: '349,90 ₺' },
  { id: 3, name: 'Slim Fit Kot Pantolon', price: '499,90 ₺' },
  { id: 4, name: 'Keten Gömlek', price: '279,90 ₺' },
  { id: 5, name: 'Örme Hırka', price: '399,90 ₺' },
  { id: 6, name: 'Spor Ayakkabı', price: '899,90 ₺' },
  { id: 7, name: 'Deri Ceket', price: '1.299,90 ₺' },
  { id: 8, name: 'Yazlık Elbise', price: '459,90 ₺' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-indigo-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-gray-900">
            Yeni Sezon Burada
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-600">
            En yeni koleksiyonu keşfet, tarzını yansıt.
          </p>
          <button className="mt-8 rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
            Alışverişe Başla
          </button>
        </div>
      </section>

      {/* Ürün grid'i - responsive: mobilde 2, tablette 3, masaüstünde 4 sütun */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Öne Çıkanlar</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
          {sampleProducts.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-gray-100">
                <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                  Ürün Görseli
                </div>
              </div>
              <h3 className="mt-3 text-sm font-medium text-gray-900 group-hover:text-indigo-600">
                {product.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-gray-700">{product.price}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
