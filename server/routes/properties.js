import express from 'express';
import prisma from '../prisma.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/properties - Lấy danh sách BĐS (có filter)
router.get('/', async (req, res) => {
  try {
    const { type, status, minPrice, maxPrice, minArea, maxArea, search, showOnHome } = req.query;
    
    const where = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (showOnHome === 'true') where.showOnHome = true;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { address: { contains: search } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (minArea || maxArea) {
      where.area = {};
      if (minArea) where.area.gte = parseFloat(minArea);
      if (maxArea) where.area.lte = parseFloat(maxArea);
    }

    const properties = await prisma.property.findMany({
      where,
      include: { images: true, project: { select: { name: true } } },
      orderBy: [
        { isFeatured: 'desc' },
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ],
    });
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách BĐS.' });
  }
});

// GET /api/properties/:identifier - Chi tiết BĐS
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    let property;
    if (!isNaN(identifier)) {
      property = await prisma.property.findUnique({
        where: { id: parseInt(identifier) },
        include: { images: true, project: true },
      });
    } else {
      property = await prisma.property.findUnique({
        where: { slug: identifier },
        include: { images: true, project: true },
      });
    }
    
    if (!property) return res.status(404).json({ error: 'Không tìm thấy BĐS.' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết BĐS.' });
  }
});

// POST /api/properties - Thêm BĐS mới (Admin only)
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const {
      title, slug, description, price, area,
      address, type, bedrooms, bathrooms, direction,
      projectId, images, mapImage, legal
    } = req.body;

    const property = await prisma.property.create({
      data: {
        title, slug, description,
        price: parseFloat(price),
        area: parseFloat(area),
        address, type,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
        bathrooms: bathrooms ? parseInt(bathrooms) : null,
        direction, mapImage, legal,
        projectId: projectId ? parseInt(projectId) : null,
        status: 'AVAILABLE',
        showOnHome: req.body.showOnHome || false,
        displayOrder: req.body.displayOrder ? parseInt(req.body.displayOrder) : 0,
        images: images?.length
          ? { create: images.map(url => ({ url })) }
          : undefined,
      },
      include: { images: true },
    });
    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi thêm BĐS.' });
  }
});

// PUT /api/properties/:id - Sửa BĐS (Admin only)
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      title, slug, description, price, area,
      address, type, status, bedrooms, bathrooms, direction, mapImage,
      legal, projectId, isFeatured, images
    } = req.body;

    const updateData = {
      title, slug, description,
      price: price ? parseFloat(price) : undefined,
      area: area ? parseFloat(area) : undefined,
      address, type, status,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      direction, mapImage,
      legal: legal !== undefined ? legal : undefined,
      projectId: projectId !== undefined ? (projectId ? parseInt(projectId) : null) : undefined,
      isFeatured: isFeatured !== undefined ? isFeatured : undefined,
      showOnHome: req.body.showOnHome !== undefined ? req.body.showOnHome : undefined,
      displayOrder: req.body.displayOrder !== undefined ? parseInt(req.body.displayOrder) : undefined,
    };

    if (images && Array.isArray(images)) {
      updateData.images = {
        deleteMany: {},
        create: images.map(url => ({ url }))
      };
    }

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
      include: { images: true },
    });
    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi cập nhật BĐS.' });
  }
});

import multer from 'multer';
import path from 'path';
import fs from 'fs';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/properties/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'property-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/upload', adminMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Không có file được upload.' });
  }
  res.json({ url: `/uploads/properties/${req.file.filename}` });
});

// DELETE /api/properties/:id - Xoá BĐS (Admin only)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.property.delete({ where: { id } });
    res.json({ message: 'Đã xoá BĐS thành công.' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xoá BĐS.' });
  }
});

// POST /api/properties/:id/favorite - Thêm/bỏ yêu thích (User)
router.post('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const propertyId = parseInt(req.params.id);
    const userId = req.user.id;

    const existing = await prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { userId_propertyId: { userId, propertyId } } });
      return res.json({ favorited: false, message: 'Đã bỏ yêu thích.' });
    }

    await prisma.favorite.create({ data: { userId, propertyId } });
    res.json({ favorited: true, message: 'Đã thêm vào yêu thích.' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật yêu thích.' });
  }
});

export default router;
