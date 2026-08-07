const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

dotenv.config();
console.log('DATABASE_URL', process.env.DATABASE_URL);
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    await prisma.$connect();
    console.log('connected');
    const categories = await prisma.category.findMany();
    console.log('categories count', categories.length);
  } catch (err) {
    console.error('error', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
