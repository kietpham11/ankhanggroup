import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const members = await prisma.member.findMany();
    console.log(members);
  } catch (error) {
    console.error('PRISMA ERROR:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
