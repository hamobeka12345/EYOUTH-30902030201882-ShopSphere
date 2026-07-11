const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const electronics = await prisma.category.upsert({
    where: { id: 1 },
    update: { name: 'Electronics' },
    create: { name: 'Electronics' }
  });
  const books = await prisma.category.upsert({
    where: { id: 2 },
    update: { name: 'Books' },
    create: { name: 'Books' }
  });

  const existingHeadphones = await prisma.product.findFirst({
    where: { name: 'Wireless Headphones' }
  });
  if (!existingHeadphones) {
    await prisma.product.create({
      data: {
        name: 'Wireless Headphones',
        description: 'Comfortable over-ear Bluetooth headphones with noise cancellation.',
        price: 99.99,
        categoryId: electronics.id
      }
    });
  }

  const existingBook = await prisma.product.findFirst({
    where: { name: 'Modern JavaScript Book' }
  });
  if (!existingBook) {
    await prisma.product.create({
      data: {
        name: 'Modern JavaScript Book',
        description: 'A practical guide to modern JavaScript development.',
        price: 29.99,
        categoryId: books.id
      }
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
