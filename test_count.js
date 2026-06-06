import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.contact.count({ where: { status: 'PENDING' } });
  console.log('PENDING CONTACTS:', count);
}
main().finally(() => prisma.$disconnect());
