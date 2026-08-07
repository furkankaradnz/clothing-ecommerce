# Cart & Addresses Modülleri

Auth gerektiren kullanıcı akışları. Sepet DB'de tutulur (kalıcı, cihazlar arası senkron).

## Cart endpoint'leri (hepsi giriş gerektirir)

| Metot  | Yol                        | Açıklama                    |
| ------ | -------------------------- | --------------------------- |
| GET    | `/api/cart`                | Sepeti getir (yoksa oluştur)|
| POST   | `/api/cart/items`          | Sepete ekle (stok kontrollü)|
| PATCH  | `/api/cart/items/:itemId`  | Adet güncelle               |
| DELETE | `/api/cart/items/:itemId`  | Kalemi kaldır               |
| DELETE | `/api/cart`                | Sepeti boşalt               |

## Addresses endpoint'leri (hepsi giriş gerektirir)

| Metot  | Yol                    | Açıklama          |
| ------ | ---------------------- | ----------------- |
| GET    | `/api/addresses`       | Adresleri listele |
| POST   | `/api/addresses`       | Adres ekle        |
| PATCH  | `/api/addresses/:id`   | Adres güncelle    |
| DELETE | `/api/addresses/:id`   | Adres sil         |

## Önemli tasarım notları
- **Stok kontrolü sepete eklerken**: sepette zaten olan adet + yeni istenen,
  varyantın stoğunu aşamaz (`cart.service.ts` içinde `desiredQty > stock`).
- **Toplam hesabı** service'te yapılır: her kalem `(basePrice + priceDiff) * quantity`.
  DB'de tutulmaz, her istekte anlık hesaplanır (fiyat değişse bile güncel kalır).
- **Sahiplik kontrolü**: bir kullanıcı başkasının sepet kalemine/adresine
  erişemez (`item.cartId !== cart.id` → Forbidden).
- **Varsayılan adres**: yeni bir adres varsayılan yapılınca öncekinin
  varsayılanlığı otomatik kaldırılır (`clearDefault`).
- Sepet response'u frontend'in ihtiyacı olan her şeyi içerir: ürün adı,
  görsel, beden/renk, birim fiyat, satır toplamı, genel toplam, adet sayısı.
