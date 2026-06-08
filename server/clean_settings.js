import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.setting.deleteMany({
    where: {
      value: 'undefined'
    }
  });
  console.log('Cleaned up corrupted settings.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
