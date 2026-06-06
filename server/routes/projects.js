import express from 'express';
import prisma from '../prisma.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects - Lấy danh sách dự án
router.get('/', async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: { images: true, _count: { select: { properties: true } } },
      orderBy: { createdAt: 'desc' },
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
    const { name, slug, description, content, location, status, images } = req.body;

    const project = await prisma.project.create({
      data: {
        name, slug, description, content, location, status,
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
    const { name, slug, description, content, location, status } = req.body;
    const project = await prisma.project.update({
      where: { id },
      data: { name, slug, description, content, location, status },
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
