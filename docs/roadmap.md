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
- [x] Görsel yükseltme: canlı renkler, gradyanlar, framer-motion animasyonları
- [x] Otomatik dönen hero carousel (kampanya slaytları)
- [x] Sonsuz kayan ürün şeridi ("kıyafet sonsuzluğu")
- [x] İndirim sistemi (indirimli fiyat, rozet, /indirim sayfası)
- [x] Öne çıkan ürünler + kampanya banner'ları
- [x] Gerçek Unsplash ürün görselleri
- [x] Admin dashboard (ciro, sipariş/ürün/kullanıcı sayısı, düşük stok, kullanıcı listesi)
- [x] Ürün görselleri: DiceBear animasyon karakterleri (manken niyetine, çok çeşitli), ürün başına 5 görsel
- [x] Kaydırmalı görsel galerisi (sürükle + ok + thumbnail)
- [x] Tarz (Casual, Grunge, Gothic, Streetwear...) ve kesim (Slim, Oversize, Bol Paça...) attribute'leri
- [x] Kapsamlı filtre paneli: belirgin arama, fiyat aralığı barı, tarz, kesim, beden, renk
- [x] Ürün ekran boyutu ayarı (2/3/4/5 sütun)
- [x] Filtre seçenekleri endpoint'i (/products/filters)
- [x] Daha eşsiz/canlı kategori kartları (karakter görselli)
- [x] Admin panelinde ürün eklerken tam 5 görsel URL'i girme (zorunlu, önizlemeli)
- [x] Seed görselleri gerçek kıyafet fotoğraflarına çevrildi (kategori+cinsiyet eşleşmeli)
