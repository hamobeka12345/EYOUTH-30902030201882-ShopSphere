const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const IMAGES = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=60&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1472437774355-71ab6752b434?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TW9kZXJuJTIwSmF2YVNjcmlwdCUyMEJvb2t8ZW58MHx8MHx8fDA%3D',
  'https://plus.unsplash.com/premium_photo-1683141392308-aaa39d916686?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1683543124615-fb42e42c6201?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1671611822374-4719df5c89bb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8V2lyZWxlc3MlMjBNb3VzZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1702047048032-e734daa2473d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fENsZWFuJTIwQ29kZSUyMEJvb2t8ZW58MHx8MHx8fDA%3D',
  'https://plus.unsplash.com/premium_photo-1718735910395-94a28fbc9f6b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U3RhaW5sZXNzJTIwU3RlZWwlMjBDb29rd2FyZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1719289799337-9cb436447965?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q2VyYW1pYyUyMENvZmZlZSUyME11Z3xlbnwwfHwwfHx8MA%3D%3D',
  'https://plus.unsplash.com/premium_photo-1718913936342-eaafff98834b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Q290dG9uJTIwVC1TaGlydHxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UnVubmluZyUyMFNuZWFrZXJzfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1646239646963-b0b9be56d6b5?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8WW9nYSUyME1hdHxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RHVtYmJlbGwlMjBTZXR8ZW58MHx8MHx8fDA%3D',
  'https://plus.unsplash.com/premium_photo-1702830270404-e45534fe75fa?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QnVpbGRpbmclMjBCbG9ja3MlMjBTZXR8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1585504198199-20277593b94f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Qm9hcmQlMjBHYW1lfGVufDB8fDB8fHww',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1591290619618-904f6dd935e3?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8V2lyZWxlc3MlMjBDaGFyZ2VyfGVufDB8fDB8fHww',
  'https://plus.unsplash.com/premium_photo-1764687896099-5b553259131e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VGhlJTIwUHJhZ21hdGljJTIwUHJvZ3JhbW1lciUyMGJvb2t8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1695089028114-ce28248f0ab9?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QWlyJTIwRnJ5ZXIlMjA1THxlbnwwfHwwfHx8MA%3D%3D',
  'https://images.unsplash.com/photo-1537465978529-d23b17165b3b?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RGVuaW0lMjBKYWNrZXR8ZW58MHx8MHx8fDA%3D',
  'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Q2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D'
];

async function ensureAdmin() {
  const email = 'admin@example.com';
  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: { name: 'Admin', email, password: hashed, role: 'admin' }
    });
    console.log('Created admin user: admin@example.com / admin123');
  }
}

async function upsertCategory(name) {
  return prisma.category.upsert({
    where: { name },
    update: { name },
    create: { name }
  });
}

async function upsertProduct(name, data) {
  const existing = await prisma.product.findFirst({ where: { name } });
  if (existing) {
    await prisma.product.update({ where: { id: existing.id }, data });
  } else {
    await prisma.product.create({ data });
  }
}

async function main() {
  await ensureAdmin();

  const electronics = await upsertCategory('Electronics');
  const books = await upsertCategory('Books');
  const home = await upsertCategory('Home & Kitchen');
  const fashion = await upsertCategory('Fashion');
  const sports = await upsertCategory('Sports & Outdoors');
  const toys = await upsertCategory('Toys & Games');

  const products = [
    { name: 'Wireless Headphones', description: 'Comfortable over-ear Bluetooth headphones with noise cancellation.', price: 99.99, categoryId: electronics.id },
    { name: 'Modern JavaScript Book', description: 'A practical guide to modern JavaScript development.', price: 29.99, categoryId: books.id },
    { name: 'Smart LED TV 43"', description: '4K Ultra HD smart television with built-in streaming apps.', price: 349.99, categoryId: electronics.id },
    { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with tactile switches.', price: 74.5, categoryId: electronics.id },
    { name: 'Wireless Mouse', description: 'Ergonomic silent-click wireless mouse with long battery life.', price: 24.99, categoryId: electronics.id },
    { name: 'Clean Code Book', description: 'A handbook of agile software craftsmanship by Robert C. Martin.', price: 34.99, categoryId: books.id },
    { name: 'Stainless Steel Cookware Set', description: '10-piece durable stainless steel pots and pans set.', price: 129.0, categoryId: home.id },
    { name: 'Ceramic Coffee Mug', description: '350ml ceramic mug with a minimalist matte finish.', price: 12.99, categoryId: home.id },
    { name: 'Cotton T-Shirt', description: 'Soft breathable 100% organic cotton crew-neck t-shirt.', price: 19.99, categoryId: fashion.id },
    { name: 'Running Sneakers', description: 'Lightweight cushioned running shoes for daily training.', price: 89.99, categoryId: fashion.id },
    { name: 'Yoga Mat', description: 'Non-slip eco-friendly exercise yoga mat with carrying strap.', price: 27.5, categoryId: sports.id },
    { name: 'Dumbbell Set', description: 'Adjustable pair of dumbbells from 2kg to 10kg each.', price: 59.99, categoryId: sports.id },
    { name: 'Building Blocks Set', description: '500-piece creative building blocks for kids aged 6+.', price: 39.99, categoryId: toys.id },
    { name: 'Board Game', description: 'Family strategy board game for 2-4 players, 45 min play.', price: 32.99, categoryId: toys.id },
    { name: 'Smartphone 128GB', description: 'Unlocked 6.5-inch smartphone with dual camera and fast charging.', price: 299.99, categoryId: electronics.id },
    { name: 'Wireless Charger', description: '15W fast wireless charging pad compatible with most phones.', price: 19.99, categoryId: electronics.id },
    { name: 'The Pragmatic Programmer', description: 'Classic guide to software craftsmanship and best practices.', price: 39.99, categoryId: books.id },
    { name: 'Air Fryer 5L', description: 'Oil-free digital air fryer with 8 cooking presets.', price: 79.99, categoryId: home.id },
    { name: 'Denim Jacket', description: 'Classic slim-fit denim jacket for casual everyday wear.', price: 49.99, categoryId: fashion.id },
    { name: 'Camping Tent 4-Person', description: 'Waterproof easy-pitch tent for 4 people with carry bag.', price: 89.0, categoryId: sports.id }
  ];

  let updated = 0;
  for (let i = 0; i < products.length; i++) {
    const data = { ...products[i], image: IMAGES[i] };
    await upsertProduct(products[i].name, data);
    updated++;
  }
  console.log(`Seeded/updated ${updated} products with provided images.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
