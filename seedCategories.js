import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { id: 1, name: 'Thị trường', slug: 'thi-truong', description: 'Tin tức thị trường' },
    { id: 2, name: 'Kinh nghiệm', slug: 'kinh-nghiem', description: 'Kinh nghiệm' },
    { id: 3, name: 'Pháp lý', slug: 'phap-ly', description: 'Pháp lý' },
    { id: 4, name: 'Dự án', slug: 'du-an', description: 'Dự án' },
    { id: 5, name: 'Phong thủy', slug: 'phong-thuy', description: 'Phong thủy' },
    { id: 6, name: 'Phong cách sống', slug: 'phong-cach-song', description: 'Phong cách sống' }
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, slug: cat.slug, description: cat.description },
      create: { id: cat.id, name: cat.name, slug: cat.slug, description: cat.description }
    });
  }
  
  console.log('Categories seeded!');
}

main().finally(() => prisma.$disconnect());
