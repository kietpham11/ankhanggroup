import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.property.updateMany({
    data: { showOnHome: true }
  });
  console.log('Updated all properties to showOnHome: true');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
