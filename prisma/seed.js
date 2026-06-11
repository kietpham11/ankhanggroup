import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Đang khởi tạo dữ liệu...\n');

  // Tạo tài khoản Admin mặc định nếu chưa có
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@ankhang.com' }
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('Ankhang@2026!', 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@ankhang.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('✅ Đã tạo tài khoản Admin mặc định: admin@ankhang.com');
  }
  // Tạo danh mục bài viết
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'thi-truong-bds' },
      update: {},
      create: { name: 'Thị trường BĐS', slug: 'thi-truong-bds', description: 'Tin tức thị trường bất động sản' },
    }),
    prisma.category.upsert({
      where: { slug: 'kinh-nghiem-mua-nha' },
      update: {},
      create: { name: 'Kinh nghiệm mua nhà', slug: 'kinh-nghiem-mua-nha', description: 'Chia sẻ kinh nghiệm' },
    }),
    prisma.category.upsert({
      where: { slug: 'phap-ly' },
      update: {},
      create: { name: 'Pháp lý', slug: 'phap-ly', description: 'Thông tin pháp lý BĐS' },
    }),
  ]);
  console.log(`✅ Đã tạo ${categories.length} danh mục bài viết`);

  // Tạo dự án mẫu
  const project = await prisma.project.upsert({
    where: { slug: 'vinhomes-grand-park' },
    update: {},
    create: {
      name: 'Vinhomes Grand Park',
      slug: 'vinhomes-grand-park',
      description: 'Đại đô thị thông minh 271ha tại TP. Thủ Đức',
      location: 'Quận 9, TP. Thủ Đức, TP. HCM',
      status: 'Đang mở bán',
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop' },
        ],
      },
    },
  });
  console.log(`✅ Dự án mẫu: ${project.name}`);

  // Tạo BĐS mẫu
  const properties = await Promise.all([
    prisma.property.upsert({
      where: { slug: 'can-ho-the-origami-thuduc' },
      update: {},
      create: {
        title: 'Căn hộ The Origami - Tầng 12',
        slug: 'can-ho-the-origami-thuduc',
        description: 'Căn hộ 2 phòng ngủ view hồ bơi, nội thất cao cấp, pháp lý sổ hồng lâu dài.',
        price: 2950000000,
        area: 59,
        address: 'Vinhomes Grand Park, TP. Thủ Đức, TP. HCM',
        type: 'APARTMENT',
        status: 'AVAILABLE',
        bedrooms: 2,
        bathrooms: 2,
        direction: 'Đông Nam',
        projectId: project.id,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop' },
          ],
        },
      },
    }),
    prisma.property.upsert({
      where: { slug: 'nha-pho-vinhomes-grand-park' },
      update: {},
      create: {
        title: 'Nhà phố Vinhomes Grand Park',
        slug: 'nha-pho-vinhomes-grand-park',
        description: 'Nhà phố thương mại 1 trệt 3 lầu, vị trí đẹp mặt tiền đường lớn.',
        price: 6800000000,
        area: 75,
        address: 'Vinhomes Grand Park, TP. Thủ Đức, TP. HCM',
        type: 'HOUSE',
        status: 'AVAILABLE',
        bedrooms: 4,
        bathrooms: 4,
        direction: 'Đông',
        projectId: project.id,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop' },
          ],
        },
      },
    }),
    prisma.property.upsert({
      where: { slug: 'biet-thu-lakeview-city-q2' },
      update: {},
      create: {
        title: 'Biệt thự Lakeview City',
        slug: 'biet-thu-lakeview-city-q2',
        description: 'Biệt thự đơn lập mặt hồ, thiết kế hiện đại, an ninh 24/7.',
        price: 12500000000,
        area: 200,
        address: 'Lakeview City, Quận 2, TP. HCM',
        type: 'VILLA',
        status: 'AVAILABLE',
        bedrooms: 4,
        bathrooms: 5,
        direction: 'Tây Nam',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&auto=format&fit=crop' },
          ],
        },
      },
    }),
    prisma.property.upsert({
      where: { slug: 'dat-nen-long-thanh-dong-nai' },
      update: {},
      create: {
        title: 'Đất nền Long Thành - Đồng Nai',
        slug: 'dat-nen-long-thanh-dong-nai',
        description: 'Đất nền sổ đỏ thổ cư 100%, đường nhựa 12m, gần sân bay Long Thành.',
        price: 2450000000,
        area: 100,
        address: 'Long Thành, Đồng Nai',
        type: 'LAND',
        status: 'AVAILABLE',
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop' },
          ],
        },
      },
    }),
  ]);
  console.log(`✅ Đã tạo ${properties.length} bất động sản mẫu`);

  // Tạo bài viết mẫu
  await prisma.post.upsert({
    where: { slug: 'thi-truong-bds-tp-hcm-2026' },
    update: {},
    create: {
      title: 'Thị trường BĐS TP.HCM năm 2026: Cơ hội và thách thức',
      slug: 'thi-truong-bds-tp-hcm-2026',
      content: 'Năm 2026, thị trường bất động sản TP.HCM đang chứng kiến nhiều biến động tích cực...',
      thumbnail: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop',
      published: true,
      authorName: 'Admin',
      categoryId: categories[0].id,
    },
  });
  console.log(`✅ Đã tạo bài viết mẫu`);

  // Tạo tin tuyển dụng mẫu
  const jobs = await Promise.all([
    prisma.job.upsert({
      where: { slug: 'nhan-vien-kinh-doanh-bds' },
      update: {},
      create: {
        title: 'Nhân viên Kinh doanh BĐS',
        slug: 'nhan-vien-kinh-doanh-bds',
        department: 'Kinh doanh',
        type: 'Toàn thời gian',
        location: 'TP. Hồ Chí Minh',
        salaryRange: '15 - 20 triệu',
        description: 'Tìm kiếm và tư vấn khách hàng mua/thuê BĐS cao cấp.',
        requirements: 'Đam mê kinh doanh, giao tiếp tốt.',
        benefits: 'Thưởng hoa hồng cao, du lịch hằng năm.',
        status: 'Đang mở',
      }
    }),
    prisma.job.upsert({
      where: { slug: 'chuyen-vien-marketing' },
      update: {},
      create: {
        title: 'Chuyên viên Marketing',
        slug: 'chuyen-vien-marketing',
        department: 'Marketing',
        type: 'Toàn thời gian',
        location: 'Hà Nội',
        salaryRange: '12 - 18 triệu',
        description: 'Lên kế hoạch marketing các dự án BĐS mới.',
        requirements: 'Kinh nghiệm 1-2 năm marketing BĐS.',
        benefits: 'Môi trường trẻ trung năng động.',
        status: 'Đang mở',
      }
    })
  ]);
  console.log(`✅ Đã tạo ${jobs.length} tin tuyển dụng`);

  // Tạo ứng viên mẫu
  const candidates = await Promise.all([
    prisma.candidate.create({
      data: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phone: '0123456789',
        cvUrl: 'https://example.com/cv/nguyenvana.pdf',
        status: 'Mới ứng tuyển',
        jobId: jobs[0].id
      }
    }),
    prisma.candidate.create({
      data: {
        name: 'Trần Thị B',
        email: 'tranthib@gmail.com',
        phone: '0987654321',
        cvUrl: 'https://example.com/cv/tranthib.pdf',
        status: 'Đang xem xét',
        jobId: jobs[1].id
      }
    })
  ]);
  console.log(`✅ Đã tạo ${candidates.length} ứng viên mẫu`);

  console.log('\n🎉 Khởi tạo dữ liệu thành công!\n');
  console.log('\n🌐 Truy cập Admin: http://localhost:5173/admin\n');
}

main()
  .catch(e => { console.error('❌ Lỗi seed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
