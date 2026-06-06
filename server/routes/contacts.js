import express from 'express';
import prisma from '../prisma.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /api/contacts - Gửi form liên hệ (Public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, propertyId } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Vui lòng điền tên và số điện thoại.' });
    }
    const contact = await prisma.contact.create({
      data: {
        name, 
        email: email || 'Không cung cấp', 
        phone, 
        message: message || 'Đăng ký nhận thông tin/tư vấn dự án.',
        propertyId: propertyId ? parseInt(propertyId) : null,
        status: 'PENDING',
      },
    });
    res.status(201).json({ message: 'Đã gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm.', contact });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi gửi liên hệ.' });
  }
});

// GET /api/contacts - Danh sách liên hệ (Admin only)
router.get('/', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};
    const contacts = await prisma.contact.findMany({
      where,
      include: { property: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách liên hệ.' });
  }
});

// PUT /api/contacts/:id/status - Cập nhật trạng thái liên hệ (Admin)
router.put('/:id/status', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body; // 'PENDING' | 'RESOLVED'
    const contact = await prisma.contact.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái.' });
  }
});

// DELETE /api/contacts/:id - Xoá liên hệ (Admin)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await prisma.contact.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Đã xoá liên hệ.' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xoá liên hệ.' });
  }
});

export default router;
