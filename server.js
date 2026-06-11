import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { LEGACY_UPLOAD_ROOT, UPLOAD_ROOT } from './server/utils/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import authRoutes from './server/routes/auth.js';
import propertyRoutes from './server/routes/properties.js';
import projectRoutes from './server/routes/projects.js';
import postRoutes from './server/routes/posts.js';
import contactRoutes from './server/routes/contacts.js';
import dashboardRoutes from './server/routes/dashboard.js';
import memberRoutes from './server/routes/members.js';
import jobRoutes from './server/routes/jobs.js';
import settingsRoutes from './server/routes/settings.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====================== MIDDLEWARE ======================
// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Để cho phép tải ảnh qua CDN/Proxy nếu cần
}));

// XSS Protection (Bỏ qua xss-clean vì lỗi với Express 5, React đã tự chống XSS)
// app.use(xss());

// CORS configuration
const normalizeOrigin = (origin) => origin.replace(/\/+$/, '');
const envOrigins = [
  process.env.CLIENT_URL,
  process.env.CLIENT_URLS,
]
  .filter(Boolean)
  .flatMap((value) => value.split(','))
  .map((value) => normalizeOrigin(value.trim()))
  .filter(Boolean);

const allowedOrigins = new Set([
  ...envOrigins,
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:5000',
  'https://ankhang-real-estate.vercel.app',
]);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.has(normalizeOrigin(origin))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Trust proxy để lấy đúng IP người dùng khi chạy trên Render / Vercel
app.set('trust proxy', 1);

// Rate limiting (chống spam / DDoS nhẹ)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 500, // Tối đa 500 request mỗi IP mỗi 15 phút
  message: { error: 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 15 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter); // Chỉ áp dụng giới hạn cho các API

app.use(express.json({ limit: '10mb' })); // Giới hạn dung lượng body
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve persistent uploads first, then fallback to legacy repo uploads.
app.use('/uploads', express.static(UPLOAD_ROOT));
if (UPLOAD_ROOT !== LEGACY_UPLOAD_ROOT) {
  app.use('/uploads', express.static(LEGACY_UPLOAD_ROOT));
}
app.use('/uploads', (req, res) => {
  res.status(404).json({ error: 'Uploaded file not found.' });
});

// ====================== API ROUTES ======================
app.use('/api/auth',        authRoutes);
app.use('/api/properties',  propertyRoutes);
app.use('/api/projects',    projectRoutes);
app.use('/api/posts',       postRoutes);
app.use('/api/contacts',    contactRoutes);
app.use('/api/dashboard',   dashboardRoutes);
app.use('/api/members',     memberRoutes);
app.use('/api/jobs',        jobRoutes);
app.use('/api/settings',    settingsRoutes);

// ====================== HEALTH CHECK ======================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '🚀 Golden Land API đang chạy', timestamp: new Date() });
});

// ====================== 404 HANDLER FOR API ======================
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route không tồn tại.' });
});

// ====================== FRONTEND SERVING (PRODUCTION) ======================
// Phục vụ các file tĩnh của React (thư mục dist) khi chạy trên Hosting/Production
app.use(express.static(path.join(__dirname, 'dist')));

// Bắt tất cả các route còn lại (không phải /api hay /uploads) và trả về index.html cho React Router xử lý
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ====================== START SERVER ======================
app.listen(PORT, () => {
  console.log(`\n🏡 ================================`);
  console.log(`   Golden Land Backend Server`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`================================\n`);
});
