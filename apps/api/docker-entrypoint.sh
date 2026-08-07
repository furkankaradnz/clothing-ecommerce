#!/bin/sh
set -e

# Migration dosyaları var mı kontrol et
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "⏳ Migration'lar uygulanıyor (prisma migrate deploy)..."
  npx prisma migrate deploy
else
  # Migration yoksa şemadan doğrudan tabloları oluştur (demo için güvenli yedek)
  echo "⏳ Migration bulunamadı, şemadan tablolar oluşturuluyor (prisma db push)..."
  npx prisma db push --skip-generate
fi

# RUN_SEED=true ise örnek veriyi yükle
if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Seed verisi yükleniyor..."
  npm run prisma:seed || echo "⚠️  Seed atlandı (muhtemelen zaten yüklü)"
fi

echo "🚀 Sunucu başlatılıyor..."
exec node dist/server.js
