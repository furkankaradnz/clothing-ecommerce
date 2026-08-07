import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://ecommerce_user:supersecret123@localhost:5432/ecommerce_db?schema=public',
});
const client = new PrismaClient({ adapter });

async function main() {
  try {
    await client.$connect();
    console.log('connected');
    const r = await client.$queryRaw`SELECT 1 AS value`;
    console.log(r);
  } catch (e) {
    console.error('error', e);
  } finally {
    await client.$disconnect();
  }
}

main();
