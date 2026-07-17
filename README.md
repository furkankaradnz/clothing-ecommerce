# 👕 Clothing E-Commerce

Giyim odaklı full-stack e-ticaret uygulaması. Monolitik mimari, Docker ile dağıtım, tamamen responsive arayüz.

## 🛠 Tech Stack

| Katman      | Teknoloji                                   |
| ----------- | ------------------------------------------- |
| Frontend    | React, TypeScript, Tailwind CSS, Vite       |
| Backend     | Node.js, Express, TypeScript, Prisma        |
| Veritabanı  | PostgreSQL                                  |
| DevOps      | Docker, Docker Compose                      |

## 📁 Proje Yapısı

```
clothing-ecommerce/
├── docker-compose.yml       # postgres + pgadmin (geliştirme)
├── .env                     # Docker ortam değişkenleri (git'e girmez)
├── apps/
│   ├── api/                 # Express + Prisma backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma # Veritabanı modelleri
│   │   │   └── seed.ts       # Örnek veri
│   │   └── src/
│   │       ├── config/       # env, prisma bağlantısı
│   │       ├── common/       # AppError, yardımcılar
│   │       ├── middlewares/  # hata yönetimi, doğrulama
│   │       ├── modules/      # auth, products, ... (özellik bazlı)
│   │       ├── app.ts        # express app kurulumu
│   │       └── server.ts     # giriş noktası
│   └── web/                  # React frontend
│       └── src/
│           ├── app/          # App + router
│           ├── components/   # ortak bileşenler (layout vb.)
│           ├── features/     # özellik bazlı sayfalar
│           └── lib/          # api client
└── docs/                     # yol haritası, notlar
```

## 🚀 Kurulum

### Ön koşullar
- Node.js 20+
- Docker Desktop

### 1. Veritabanını başlat
```bash
# Kök dizinde
docker compose up -d
```

### 2. Backend
```bash
cd apps/api
npm install
npx prisma generate
npx prisma migrate dev --name init   # tabloları oluşturur
npm run prisma:seed                  # örnek veri (opsiyonel)
npm run dev                          # http://localhost:5000
```
Test: http://localhost:5000/api/health

### 3. Frontend
```bash
cd apps/web
npm install
npm run dev                          # http://localhost:3000
```

## 🗄 Faydalı komutlar

| Komut                         | Açıklama                          |
| ----------------------------- | -------------------------------- |
| `npx prisma studio`           | Veritabanını tarayıcıda görüntüle |
| `npx prisma migrate dev`      | Yeni migration oluştur/uygula     |
| `docker compose down`         | Konteynerleri durdur              |
| `docker compose down -v`      | Konteyner + verileri sil          |

## 🗺 Yol Haritası

- [x] Hafta 1: Altyapı, Docker, proje iskeleti
- [ ] Hafta 2: Kimlik doğrulama (JWT, rol bazlı erişim)
- [ ] Hafta 3: Ürün / kategori / varyant CRUD, görsel yükleme
- [ ] Hafta 4: Frontend katalog, ürün detay (responsive)
- [ ] Hafta 5: Sepet, favoriler, adres yönetimi
- [ ] Hafta 6: Checkout, sipariş akışı, stok düşme (transaction)
- [ ] Hafta 7: Admin paneli, yorumlar, arama
- [ ] Hafta 8: Test, iyileştirme, Docker prod build, sunum

## 📝 Notlar
- Stok **varyant** seviyesinde tutulur (beden + renk kombinasyonu).
- Sipariş kalemlerinde ürün adı ve fiyat **kopyalanır**; ürün sonradan değişse bile geçmiş sipariş korunur.
- Teslimat adresi sipariş anında **snapshot** olarak saklanır.
