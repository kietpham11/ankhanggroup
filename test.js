import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const cats = await prisma.category.findMany();
  console.log('Categories:', cats);
}
main().finally(() => prisma.$disconnect());
