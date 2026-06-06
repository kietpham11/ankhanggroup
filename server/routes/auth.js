import express from 'express';
import { generateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ankhang.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ankhang@2026!';

const adminUser = {
  id: 1,
  name: 'Admin',
  email: ADMIN_EMAIL,
  role: 'ADMIN'
};

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = generateToken(adminUser);
      return res.json({ token, user: adminUser });
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
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'golden_land_secret_key_2026');
    
    if (decoded.id === adminUser.id) {
      res.json(adminUser);
    } else {
      res.status(401).json({ error: 'Token không hợp lệ.' });
    }
  } catch (error) {
    res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
});

export default router;
