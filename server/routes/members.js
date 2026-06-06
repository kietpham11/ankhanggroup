import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/members - Lấy danh sách đội ngũ lãnh đạo
router.get('/', async (req, res) => {
  try {
    const members = await prisma.member.findMany({
      orderBy: [
        { orderIndex: 'asc' },
        { createdAt: 'asc' }
      ]
    });
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách đội ngũ lãnh đạo.' });
  }
});

// POST /api/members - Thêm mới lãnh đạo
router.post('/', async (req, res) => {
  try {
    const { name, email, avatar, position, description, isLeader, status, orderIndex, facebook, zalo, tiktok } = req.body;
    
    // Kiểm tra đầu vào cơ bản
    if (!name || !position) {
      return res.status(400).json({ error: 'Tên và chức vụ là bắt buộc.' });
    }

    const newMember = await prisma.member.create({
      data: {
        name,
        email: email || null,
        avatar: avatar || null,
        position,
        description: description || null,
        isLeader: isLeader || false,
        status: status || 'Đang hiển thị',
        orderIndex: orderIndex ? parseInt(orderIndex) : 0,
        facebook: facebook || null,
        zalo: zalo || null,
        tiktok: tiktok || null,
      }
    });
    
    res.status(201).json(newMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi thêm đội ngũ lãnh đạo.' });
  }
});

// PUT /api/members/:id - Cập nhật thông tin lãnh đạo
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, avatar, position, description, isLeader, status, orderIndex, facebook, zalo, tiktok } = req.body;

    const existingMember = await prisma.member.findUnique({ where: { id: parseInt(id) } });
    if (!existingMember) {
      return res.status(404).json({ error: 'Không tìm thấy thành viên này.' });
    }

    const updatedMember = await prisma.member.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        avatar,
        position,
        description,
        isLeader,
        status,
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : existingMember.orderIndex,
        facebook: facebook !== undefined ? facebook : existingMember.facebook,
        zalo: zalo !== undefined ? zalo : existingMember.zalo,
        tiktok: tiktok !== undefined ? tiktok : existingMember.tiktok
      }
    });

    res.json(updatedMember);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi cập nhật thông tin thành viên.' });
  }
});

// DELETE /api/members/:id - Xóa thành viên
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const existingMember = await prisma.member.findUnique({ where: { id: parseInt(id) } });
    if (!existingMember) {
      return res.status(404).json({ error: 'Không tìm thấy thành viên này.' });
    }

    await prisma.member.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Đã xóa thành viên thành công.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi xóa thành viên.' });
  }
});

export default router;
