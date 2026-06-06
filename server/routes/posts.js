import express from 'express';
import prisma from '../prisma.js';
import { adminMiddleware } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Setup Multer for post thumbnail uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/posts/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// GET /api/posts - Lấy danh sách bài viết (chỉ lấy bài đã published)
router.get('/', async (req, res) => {
  try {
    const { categoryId, search } = req.query;
    const where = { published: true };
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (search) where.title = { contains: search };

    const posts = await prisma.post.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách bài viết.' });
  }
});

// GET /api/posts/admin - Lấy tất cả bài viết cho Admin
router.get('/admin', adminMiddleware, async (req, res) => {
  try {
    const { categoryId, search } = req.query;
    const where = {};
    if (categoryId) where.categoryId = parseInt(categoryId);
    if (search) where.title = { contains: search };

    const posts = await prisma.post.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh sách bài viết cho admin.' });
  }
});

// GET /api/posts/:slug - Chi tiết bài viết + comments
router.get('/:slug', async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        comments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!post) return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy bài viết.' });
  }
});

// POST /api/posts - Tạo bài viết mới (Admin)
router.post('/', adminMiddleware, upload.single('thumbnailFile'), async (req, res) => {
  try {
    const { title, slug, content, published, categoryId, authorName } = req.body;
    let thumbnailUrl = null;
    if (req.file) {
      thumbnailUrl = `/uploads/posts/${req.file.filename}`;
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
        content,
        thumbnail: thumbnailUrl,
        published: published === 'true' || published === true,
        authorName: authorName || 'Admin',
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    fs.appendFileSync('error.log', 'CREATE ERROR: ' + (error.stack || error) + '\n');
    res.status(500).json({ error: 'Lỗi khi tạo bài viết.' });
  }
});

// PUT /api/posts/:id - Cập nhật bài viết (Admin)
router.put('/:id', adminMiddleware, upload.single('thumbnailFile'), async (req, res) => {
  try {
    const { title, slug, content, published, categoryId, authorName } = req.body;
    
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = (published === 'true' || published === true);
    if (authorName !== undefined) updateData.authorName = authorName || 'Admin';
    if (categoryId !== undefined) updateData.categoryId = categoryId ? parseInt(categoryId) : null;

    if (req.file) {
      updateData.thumbnail = `/uploads/posts/${req.file.filename}`;
    }

    const post = await prisma.post.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
    });
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    fs.appendFileSync('error.log', 'UPDATE ERROR: ' + (error.stack || error) + '\n');
    res.status(500).json({ error: 'Lỗi khi cập nhật bài viết.' });
  }
});

// DELETE /api/posts/:id - Xoá bài viết (Admin)
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Đã xoá bài viết.' });
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi xoá bài viết.' });
  }
});

// GET /api/posts/categories/all - Lấy danh mục
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { posts: true } } },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi lấy danh mục.' });
  }
});

export default router;
