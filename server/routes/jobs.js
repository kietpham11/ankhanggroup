import express from 'express';
import { adminMiddleware } from '../middleware/auth.js';
import prisma from '../prisma.js';
import { createCvUpload, createUploadStorage, runSingleUpload } from '../utils/upload.js';

const router = express.Router();

// Multer Config
const storage = createUploadStorage('cvs');
const upload = createCvUpload(storage);

// ======================= JOBS =======================

// Lấy danh sách tin tuyển dụng
router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { candidates: true }
        }
      }
    });
    // Format output
    const formattedJobs = jobs.map(job => ({
      ...job,
      candidatesCount: job._count.candidates
    }));
    res.json(formattedJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách tin tuyển dụng.' });
  }
});

// Lấy chi tiết 1 tin
router.get('/:id', async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!job) return res.status(404).json({ error: 'Không tìm thấy tin tuyển dụng.' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy chi tiết tin tuyển dụng.' });
  }
});

// Tạo tin tuyển dụng mới
router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { title, slug, department, location, type, salaryRange, description, requirements, benefits, hrName, hrPhone, hrEmail, hrAddress, status, deadline } = req.body;
    
    // Parse deadline to ISO string if provided
    let parsedDeadline = null;
    if (deadline) {
      parsedDeadline = new Date(deadline);
    }

    const newJob = await prisma.job.create({
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
        department,
        location,
        type,
        salaryRange,
        description,
        requirements,
        benefits,
        hrName,
        hrPhone,
        hrEmail,
        hrAddress,
        status: status || 'Đang mở',
        deadline: parsedDeadline
      }
    });
    res.json(newJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi tạo tin tuyển dụng.' });
  }
});

// Sửa tin tuyển dụng
router.put('/:id', adminMiddleware, async (req, res) => {
  try {
    const { title, slug, department, location, type, salaryRange, description, requirements, benefits, hrName, hrPhone, hrEmail, hrAddress, status, deadline } = req.body;
    
    let parsedDeadline = undefined;
    if (deadline !== undefined) {
      parsedDeadline = deadline ? new Date(deadline) : null;
    }

    const updatedJob = await prisma.job.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title, slug, department, location, type, salaryRange, description, requirements, benefits, hrName, hrPhone, hrEmail, hrAddress, status,
        deadline: parsedDeadline
      }
    });
    res.json(updatedJob);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi cập nhật tin tuyển dụng.' });
  }
});

// Xóa tin tuyển dụng
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await prisma.job.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ success: true, message: 'Đã xóa tin tuyển dụng' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi xóa tin tuyển dụng.' });
  }
});

// ======================= CANDIDATES =======================

// Lấy danh sách TẤT CẢ ứng viên
router.get('/candidates/all', adminMiddleware, async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        job: { select: { title: true } }
      }
    });
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách ứng viên.' });
  }
});

// Nộp hồ sơ ứng tuyển (Thêm candidate)
router.post('/:id/candidates', runSingleUpload(upload, 'cvFile'), async (req, res) => {
  try {
    const { name, email, phone, coverLetter } = req.body;
    
    // Nếu upload file thành công, gán đường dẫn
    let cvUrl = req.body.cvUrl || '';
    if (req.file) {
      cvUrl = '/uploads/cvs/' + req.file.filename;
    }

    const newCandidate = await prisma.candidate.create({
      data: {
        name,
        email,
        phone,
        cvUrl,
        coverLetter,
        jobId: parseInt(req.params.id)
      }
    });
    res.json(newCandidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi nộp hồ sơ.' });
  }
});

// Cập nhật trạng thái ứng viên
router.put('/candidates/:id', adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedCandidate = await prisma.candidate.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(updatedCandidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái ứng viên.' });
  }
});

export default router;
