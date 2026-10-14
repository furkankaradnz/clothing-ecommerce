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
- [x] Hafta 2: Kimlik doğrulama (JWT, rol bazlı erişim)
- [x] Hafta 3: Ürün / kategori / varyant CRUD, filtreleme
- [ ] Hafta 4: Frontend katalog, ürün detay (responsive)
- [x] Hafta 5: Sepet, adres yönetimi
- [x] Hafta 6: Checkout, sipariş akışı, stok düşme (transaction)
- [x] Hafta 7: Admin paneli, yorumlar, arama
- [ ] Hafta 8: Test, iyileştirme, Docker prod build, sunum

## 📝 Notlar
- Stok **varyant** seviyesinde tutulur (beden + renk kombinasyonu).
- Sipariş kalemlerinde ürün adı ve fiyat **kopyalanır**; ürün sonradan değişse bile geçmiş sipariş korunur.
- Teslimat adresi sipariş anında **snapshot** olarak saklanır.

## 🤖 AI Asistan (Chatbot)

Site sağ altındaki chatbot, Google Gemini ile doğal dilde ürün önerisi yapar
(örn: "300 TL altında tişört öner"). Çalışması için ücretsiz bir Gemini API
anahtarı gerekir:

1. https://aistudio.google.com/apikey → "Create API key"
2. `apps/api/.env` içine: `GEMINI_API_KEY=AIza...`
3. Backend'i yeniden başlat

Anahtar olmadan site çalışır ama chatbot 503 döner. Detay: `apps/api/src/modules/chat/README.md`

## 🐳 Production Dağıtımı (Docker)

Tüm site (veritabanı + backend + frontend) tek komutla ayağa kalkar.

### 1. Ortam değişkenlerini ayarla
Kök dizindeki `.env` dosyasını düzenle:
- `JWT_ACCESS_SECRET` ve `JWT_REFRESH_SECRET` — uzun rastgele değerler gir
- `GEMINI_API_KEY` — chatbot için (opsiyonel, https://aistudio.google.com/apikey)
- `RUN_SEED=true` — ilk kurulumda örnek veriyi yükler

### 2. Tüm servisleri başlat
```bash
docker compose -f docker-compose.prod.yml up --build
```

Bu komut sırasıyla:
1. PostgreSQL'i başlatır (sağlıklı olana kadar bekler)
2. Backend'i build eder, migration'ları uygular, (opsiyonel) seed yükler, API'yi başlatır
3. Frontend'i build eder, Nginx ile sunar

### 3. Erişim
- **Site:** http://localhost
- **API:** http://localhost/api/health

### 4. İlk kurulumdan sonra
`.env` içinde `RUN_SEED=false` yap (seed'in tekrar çalışmasına gerek yok).

### Durdurma
```bash
docker compose -f docker-compose.prod.yml down       # servisleri durdur
docker compose -f docker-compose.prod.yml down -v    # + verileri sil
```

### Mimari
```
[Tarayıcı] → :80 [Nginx/web] ──/──→ statik React dosyaları
                              └─/api→ [api:5000] → [db:5432 Postgres]
```
Frontend Nginx, `/api` isteklerini backend konteynerine proxy'ler; kullanıcı
tek bir port (80) üzerinden hem siteye hem API'ye erişir.

## 🎨 Ürün Görselleri

Örnek (seed) ürün görselleri, ücretsiz stok fotoğraf sitelerinden (Unsplash,
Pexels) alınan gerçek kıyafet fotoğraflarıdır ve ürünün kategorisi/cinsiyetiyle
örtüşür (kadın elbise → elbise fotoğrafı, erkek tişört → erkek tişört, ayakkabı
→ ayakkabı vb.). Her ürünün 5 görseli vardır; tarayıcı bunları doğrudan yükler.

Admin panelinden yeni ürün eklerken **tam 5 görsel URL'i** girilmesi zorunludur;
ilk görsel kapak (birincil) görsel olur.
