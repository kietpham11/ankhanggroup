import express from 'express';
import prisma from '../prisma.js';
import { adminMiddleware } from '../middleware/auth.js';
import { createImageUpload, runSingleUpload } from '../utils/upload.js';

const router = express.Router();

// GET /api/settings/:key
router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await prisma.setting.findUnique({
      where: { key: key.toUpperCase() }
    });
    
    if (!setting) {
      return res.json({ value: null });
    }

    try {
      // Try to parse JSON if possible, otherwise return string
      const parsedValue = JSON.parse(setting.value);
      return res.json({ value: parsedValue });
    } catch (e) {
      return res.json({ value: setting.value });
    }
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ error: 'Lỗi khi lấy cài đặt.' });
  }
});

// PUT /api/settings/:key
// Require admin authentication
router.put('/:key', adminMiddleware, async (req, res) => {
  try {
    const { key } = req.params;
    let { value, description } = req.body;

    // Check if user is admin
    if (req.user?.role !== 'ADMIN' && req.user?.id !== 1) {
      return res.status(403).json({ error: 'Chỉ Admin mới có quyền cập nhật cài đặt.' });
    }

    // Convert object to JSON string if it's not a string
    let stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    const setting = await prisma.setting.upsert({
      where: { key: key.toUpperCase() },
      update: { 
        value: stringValue,
        ...(description !== undefined && { description })
      },
      create: { 
        key: key.toUpperCase(), 
        value: stringValue,
        description: description || ''
      }
    });

    try {
      const parsedValue = JSON.parse(setting.value);
      return res.json({ message: 'Cập nhật thành công', setting: { ...setting, value: parsedValue } });
    } catch (e) {
      return res.json({ message: 'Cập nhật thành công', setting });
    }
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Lỗi khi cập nhật cài đặt.' });
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
    const uploadDir = path.join(__dirname, '../uploads/settings/');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = createImageUpload(storage);

router.post('/upload', adminMiddleware, runSingleUpload(upload, 'image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Không có file được upload.' });
  }
  res.json({ url: `/uploads/settings/${req.file.filename}` });
});

export default router;
