import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

async function bootstrap() {
  const app = createApp();

  try {
    await prisma.$connect();
    console.log('✅ Veritabanı bağlantısı başarılı');
  } catch (err) {
    console.error('❌ Veritabanına bağlanılamadı:', err);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`🚀 API http://localhost:${env.port} adresinde çalışıyor`);
    console.log(`   Ortam: ${env.nodeEnv}`);
  });
}

bootstrap();
