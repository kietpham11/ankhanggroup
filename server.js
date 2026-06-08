import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

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
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://ankhang-real-estate.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
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

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'server/uploads')));

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

// ====================== 404 HANDLER ======================
app.use('/api/{*path}', (req, res) => {
  res.status(404).json({ error: 'API route không tồn tại.' });
});

// ====================== START SERVER ======================
app.listen(PORT, () => {
  console.log(`\n🏡 ================================`);
  console.log(`   Golden Land Backend Server`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`================================\n`);
});
