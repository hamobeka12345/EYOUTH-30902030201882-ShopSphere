const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: { email: 'admin@test.com', password: 'admin123', role: 'admin' }
  });
}
main().catch(e => console.error(e)).finally(() => prisma.());
