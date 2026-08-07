import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL!,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    accessExpires: process.env.JWT_ACCESS_EXPIRES || '15m',
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || '7d',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    // Model adı değişebilir; AI Studio'da güncel ücretsiz modeli kontrol edip buradan değiştir
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  },
};
