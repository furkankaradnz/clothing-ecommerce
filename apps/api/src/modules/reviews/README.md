# Reviews Modülü

Ürün değerlendirmeleri (1-5 yıldız + opsiyonel yorum). Sipariş modülüyle entegre.

## Endpoint'ler

| Metot  | Yol                              | Açıklama              | Koruma |
| ------ | -------------------------------- | --------------------- | ------ |
| GET    | `/api/reviews/product/:productId`| Yorumlar + ortalama   | -      |
| POST   | `/api/reviews/product/:productId`| Yorum ekle            | Giriş  |
| DELETE | `/api/reviews/:id`               | Yorum sil             | Giriş  |

## İş kuralları
- **Sadece satın alanlar yorum yapabilir**: `hasPurchased` kontrolü, kullanıcının
  bir siparişinde o ürünün herhangi bir varyantının geçip geçmediğine bakar.
  Satın almamışsa → 403 Forbidden.
- **Ürün başına tek yorum**: `@@unique([productId, userId])` şemada zorunlu.
  Zaten yorum yapmışsa → 409 Conflict.
- **Puan aralığı**: 1-5 arası tam sayı (Zod ile doğrulanır).
- **Silme yetkisi**: kullanıcı kendi yorumunu, admin ise herkesinkini silebilir.

## Ortalama puan
`getStats` Prisma `aggregate` ile `_avg.rating` ve `_count.rating` döndürür.
Frontend bunu yıldız gösterimi ve "X / 5" olarak kullanır.

## Sipariş entegrasyonu
Bu modül `orderItem` tablosunu sorgular — yani yorum sistemi, Hafta 6'da
kurduğumuz sipariş akışına bağımlıdır. "Satın alma" = teslim edilmiş sipariş
değil, herhangi bir sipariş (basitlik için); istenirse sadece DELIVERED
siparişlere göre daraltılabilir.
