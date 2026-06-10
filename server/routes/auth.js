import express from 'express';
import { generateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const adminUser = {
  id: 1,
  name: 'Admin',
  email: process.env.ADMIN_EMAIL,
  role: 'ADMIN'
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ error: 'Admin account is not configured.' });
    }

    if (email === adminEmail && password === adminPassword) {
      const user = { ...adminUser, email: adminEmail };
      const token = generateToken(user);
      return res.json({ token, user });
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
    
    if (decoded.id === adminUser.id) {
      res.json({ ...adminUser, email: process.env.ADMIN_EMAIL });
    } else {
      res.status(401).json({ error: 'Token không hợp lệ.' });
    }
  } catch (error) {
    res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
});

export default router;
