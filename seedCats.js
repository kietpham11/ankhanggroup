import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  await prisma.category.deleteMany();
  const cats = [
    'Thị trường',
    'Kinh nghiệm',
    'Pháp lý',
    'Dự án',
    'Phong thủy',
    'Phong cách sống'
  ];
  for (const name of cats) {
    await prisma.category.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
        description: name
      }
    });
  }
  console.log('Done seeding categories.');
}

run().catch(console.error).finally(() => prisma.$disconnect());
