# Haftalık Yol Haritası & Görev Takibi

> Trello panosuyla paralel tut. Her cuma progress check öncesi güncelle.

## Hafta 1 — Altyapı ✅
- [x] GitHub repo + VS Code entegrasyonu
- [x] Klasör yapısı (monorepo: apps/api, apps/web)
- [x] Docker Compose (PostgreSQL + pgAdmin)
- [x] Prisma şeması (User, Product, Variant, Order...)
- [x] Express iskelet + health endpoint
- [x] Vite + React + Tailwind iskelet + responsive layout

## Hafta 2 — Kimlik Doğrulama ✅
- [x] Register / Login endpoint'leri (bcrypt ile hash)
- [x] JWT access + refresh token
- [x] auth middleware (token doğrulama)
- [x] rol bazlı yetki middleware (CUSTOMER / ADMIN)
- [x] Frontend: giriş / kayıt sayfaları

## Hafta 3 — Katalog ✅
- [x] Kategori CRUD
- [x] Ürün CRUD + varyant yönetimi
- [ ] Görsel yükleme (Multer)
- [x] Filtreleme, sıralama, sayfalama (pagination)

## Hafta 4 — Frontend Katalog
- [x] Ürün listeleme sayfası (API bağlı)
- [x] Ürün detay sayfası (beden/renk seçimi)
- [ ] Kategori sayfaları
- [x] Arama çubuğu

## Hafta 5 — Sepet & Kullanıcı ✅
- [x] Sepete ekle / çıkar / adet güncelle
- [ ] Favoriler
- [ ] Profil sayfası
- [x] Adres yönetimi

## Hafta 6 — Sipariş ✅
- [x] Checkout akışı
- [x] Sipariş oluşturma (transaction ile stok düşme)
- [x] Sipariş geçmişi
- [x] Sipariş durumu takibi

## Hafta 7 — Admin & Ekstra ✅
- [x] Admin paneli (ürün/sipariş yönetimi)
- [x] Ürün yorumları
- [x] Gelişmiş arama

## Hafta 8 — Bitiş
- [ ] Testler
- [ ] UI/UX iyileştirmeleri
- [ ] Docker production build (tüm servisler)
- [ ] Sunum hazırlığı

## Ek Özellikler (çekirdek sonrası)
- [x] AI Asistan chatbot (Gemini ile ürün önerisi + filtreleme)
- [x] Genişletilmiş kategori ağacı (5 üst + 28 alt kategori)
- [x] Tıklanabilir footer + statik sayfalar (SSS, Hakkımızda, İletişim, Kargo, İade)
- [x] Chatbot kapatma butonu iyileştirildi
- [x] Zengin ürün detayı (galeri, sekmeler, renk/beden, malzeme/bakım bilgisi)
- [x] Bol örnek veri (66 ürün, 810 varyant)
- [x] Üst kategori filtresi alt kategori ürünlerini de getirir
