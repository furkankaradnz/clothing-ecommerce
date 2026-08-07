# Orders Modülü

Projenin en kritik backend işlemini içerir: **atomik stok düşme transaction'ı.**

## Endpoint'ler

| Metot  | Yol                              | Açıklama              | Koruma |
| ------ | -------------------------------- | --------------------- | ------ |
| POST   | `/api/orders`                    | Sipariş oluştur       | Giriş  |
| GET    | `/api/orders`                    | Kendi siparişlerim    | Giriş  |
| GET    | `/api/orders/:id`                | Sipariş detayı        | Giriş  |
| GET    | `/api/orders/admin/all`          | Tüm siparişler        | ADMIN  |
| PATCH  | `/api/orders/admin/:id/status`   | Durum güncelle        | ADMIN  |

## Sipariş oluşturma transaction'ı (order.service.ts)

Tek `prisma.$transaction` içinde, ya hepsi ya hiçbiri:

1. **Stoğu transaction içinde tekrar oku** — race condition'a karşı en güncel değer
2. **Stok yeterliliğini kontrol et** — yetersizse hata → tüm işlem geri alınır (rollback)
3. **Stoğu düş** — `stock - quantity`
4. **Fiyatı ve ürün adını KOPYALA** — sipariş anındaki değerler (ürün sonradan değişse bile korunur)
5. **Adresi snapshot olarak sakla** — JSON; kullanıcı adresi silse bile sipariş bozulmaz
6. **Payment kaydı oluştur** — sahte (COMPLETED), gerçek çekim yok
7. **Sepeti boşalt**

## Neden transaction şart?
Bu adımların biri yarıda kalırsa veri tutarsız kalır (stok gitti ama sipariş yok gibi).
Transaction, hata durumunda tüm değişiklikleri geri alır.

## Sipariş durumları
`PENDING → PAID → SHIPPED → DELIVERED` (veya `CANCELLED`).
Sahte ödeme başarılı sayıldığı için sipariş direkt `PAID` başlar.

## Güvenlik notları
- Kart numarası **saklanmaz** (sadece format doğrulanır). Gerçek projede
  asla ham kart verisi tutulmaz — ödeme sağlayıcı token'ı kullanılır.
- Kullanıcı sadece kendi siparişlerini görebilir (sahiplik kontrolü).
