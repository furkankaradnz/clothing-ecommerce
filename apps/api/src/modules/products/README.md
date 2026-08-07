# Products & Categories Modülleri

Auth'taki katman kalıbının katalog için uygulanmış hali. İki modül de
`routes → controller → service → repository → schema` yapısını takip eder.

## Products endpoint'leri

| Metot | Yol                        | Açıklama                  | Koruma |
| ----- | -------------------------- | ------------------------- | ------ |
| GET   | `/api/products`            | Filtreli + sayfalı liste  | -      |
| GET   | `/api/products/slug/:slug` | Slug ile detay            | -      |
| GET   | `/api/products/:id`        | ID ile detay              | -      |
| POST  | `/api/products`            | Ürün + varyant oluştur    | ADMIN  |
| PATCH | `/api/products/:id`        | Ürün güncelle             | ADMIN  |
| DELETE| `/api/products/:id`        | Ürün sil                  | ADMIN  |

## Filtreleme (query string)

`GET /api/products?category=tisort&search=pamuk&minPrice=100&maxPrice=500&size=M&color=Siyah&sort=price-asc&page=1&limit=12`

| Param      | Açıklama                                             |
| ---------- | --------------------------------------------------- |
| `category` | Kategori slug'ı                                     |
| `search`   | Ad + açıklamada arama (büyük/küçük harf duyarsız)    |
| `minPrice`/`maxPrice` | Fiyat aralığı                            |
| `size`     | Beden (o bedende varyantı olan ürünler)             |
| `color`    | Renk                                                |
| `sort`     | newest, price-asc, price-desc, name-asc             |
| `page`/`limit` | Sayfalama (limit max 100)                       |

## Önemli tasarım notları
- Stok **varyant** seviyesinde. Filtre `variants: { some: {...} }` ile
  "en az bir varyantı eşleşen ürünler"i getirir.
- Ürün + varyantlar tek `create` çağrısında (nested write) oluşturulur.
- Liste ve toplam sayı `Promise.all` ile paralel çekilir (pagination için).
- Yazma işlemleri `authorize('ADMIN')` ile korunur; okuma herkese açık.
