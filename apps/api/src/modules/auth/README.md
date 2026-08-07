# Auth Modülü

Kimlik doğrulama ve yetkilendirme. Tüm modüllerin uyması gereken
**controller → service → repository** katman ayrımının referans örneğidir.

## Katmanlar

| Dosya                 | Sorumluluk                                        |
| --------------------- | ------------------------------------------------- |
| `auth.routes.ts`      | Endpoint tanımları + middleware zinciri           |
| `auth.controller.ts`  | Sadece req/res. İş mantığı YOK.                   |
| `auth.service.ts`     | İş mantığı (hash, token, kural kontrolü)          |
| `auth.repository.ts`  | Sadece veritabanı erişimi (Prisma)                |
| `auth.schema.ts`      | Zod ile girdi doğrulama şemaları                  |

## Endpoint'ler

| Metot | Yol                  | Açıklama                    | Koruma   |
| ----- | -------------------- | --------------------------- | -------- |
| POST  | `/api/auth/register` | Yeni kullanıcı + token       | -        |
| POST  | `/api/auth/login`    | Giriş + token                | -        |
| POST  | `/api/auth/refresh`  | Access token yenile          | -        |
| GET   | `/api/auth/me`       | Profil bilgisi               | Token    |

## Yeni modül eklerken bu kalıbı kopyala
Örneğin `products` modülü de aynı 5 dosyaya sahip olmalı:
routes → controller → service → repository → schema.

## Güvenlik notları
- Şifreler bcrypt ile hash'lenir, asla düz metin saklanmaz.
- `passwordHash` hiçbir zaman client'a dönülmez (`toPublicUser`).
- Access token kısa ömürlü (15dk), refresh token uzun (7gün).
- Rol kontrolü için `authorize('ADMIN')` middleware'i kullanılır.
