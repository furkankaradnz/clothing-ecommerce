FROM node:20-alpine

WORKDIR /app

# Bağımlılıklar (prisma CLI dahil - migration için gerekli)
COPY package*.json ./
RUN npm install

# Kaynak kod
COPY . .

# Prisma client üret + TypeScript derle
RUN npx prisma generate
RUN npm run build

# Entrypoint script'ini çalıştırılabilir yap
RUN chmod +x docker-entrypoint.sh

EXPOSE 5000

# Container başlarken: migration -> (opsiyonel seed) -> sunucu
ENTRYPOINT ["./docker-entrypoint.sh"]
