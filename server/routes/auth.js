import express from 'express';
import { generateToken } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const { password: _, ...userWithoutPassword } = user;
      const token = generateToken(userWithoutPassword);
      return res.json({ token, user: userWithoutPassword });
    } else {
      return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi khi đăng nhập.' });
  }
});

// GET /api/auth/me - Lấy thông tin user hiện tại từ token
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Chưa đăng nhập.' });

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } else {
      res.status(401).json({ error: 'Người dùng không tồn tại.' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
});

export default router;
