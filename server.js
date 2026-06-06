import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ====================== MIDDLEWARE ======================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
