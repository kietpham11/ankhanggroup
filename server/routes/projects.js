import express from 'express';
import prisma from '../prisma.js';
import { adminMiddleware } from '../middleware/auth.js';
import { sanitizeHtml } from '../utils/html.js';

const router = express.Router();

// GET /api/projects - Lấy danh sách dự án
router.get('/', async (req, res) => {
  try {
    const { showOnHome } = req.query;
    const where = {};
    if (showOnHome === 'true') {
      where.OR = [
        { showOnHome: true },
        { isFeatured: true },
      ];
    }

    const projects = await prisma.project.findMany({
      where,
      include: { images: true, _count: { select: { properties: true } } },
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách dự án.' });
  }
});

// GET /api/projects/:slug - Chi tiết dự án + BĐS bên trong
router.get('/:slug', async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug },
      include: {
        images: true,
        properties: { include: { images: true } },
      },
    });
    if (!project) return res.status(404).json({ error: 'Không tìm thấy dự án.' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết dự án.' });
  }
});

// POST /api/projects - Tạo dự án mới (Admin)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { 
      name, slug, description, content, location, status, images, price,
      category, province, district, ward, area, roomCount, amenities,
      developer, ownership, partner, totalUnits, legal, handoverDate,
      mapAddress, mapCoordinates, mapImage, displayOrder, showOnHome, isFeatured
    } = req.body;

    const project = await prisma.project.create({
      data: {
        name, slug, description, content: sanitizeHtml(content), location, status, price,
        category, province, district, ward, area, roomCount, amenities,
        developer, ownership, partner, totalUnits, legal, handoverDate,
        mapAddress, mapCoordinates, mapImage,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0, 
        showOnHome: showOnHome === true || showOnHome === 'true',
        isFeatured: isFeatured === true || isFeatured === 'true',
        images: images?.length
          ? { create: images.map(url => ({ url })) }
          : undefined,
      },
      include: { images: true },
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi tạo dự án.' });
  }
});

// PUT /api/projects/:id - Cập nhật dự án (Admin)
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { 
      name, slug, description, content, location, status, price,
      category, province, district, ward, area, roomCount, amenities,
      developer, ownership, partner, totalUnits, legal, handoverDate,
      mapAddress, mapCoordinates, mapImage, displayOrder, showOnHome, isFeatured, images
    } = req.body;

    const updateData = { 
      name, slug, description,
      content: content !== undefined ? sanitizeHtml(content) : undefined,
      location, status, price,
      category, province, district, ward, area, roomCount, amenities,
      developer, ownership, partner, totalUnits, legal, handoverDate,
      mapAddress, mapCoordinates, mapImage,
      displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined, 
      showOnHome: showOnHome !== undefined ? (showOnHome === true || showOnHome === 'true') : undefined,
      isFeatured: isFeatured !== undefined ? (isFeatured === true || isFeatured === 'true') : undefined
    };

    if (images && Array.isArray(images)) {
      updateData.images = {
        deleteMany: {},
        create: images.map(url => ({ url }))
      };
    }
    
    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: { images: true },
    });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật dự án.' });
  }
});

// DELETE /api/projects/:id - Xoá dự án (Admin)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await prisma.project.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Đã xoá dự án thành công.' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xoá dự án.' });
  }
});

export default router;
