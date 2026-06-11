import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const MB = 1024 * 1024;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

export const IMAGE_UPLOAD_LIMIT = 5 * MB;
export const CV_UPLOAD_LIMIT = 5 * MB;
export const LEGACY_UPLOAD_ROOT = path.join(PROJECT_ROOT, 'server', 'uploads');
export const UPLOAD_ROOT = process.env.UPLOAD_ROOT
  ? path.resolve(process.env.UPLOAD_ROOT)
  : LEGACY_UPLOAD_ROOT;

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

const CV_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const CV_EXTENSIONS = new Set(['.pdf', '.doc', '.docx']);

function createFileFilter({ allowedMimeTypes, allowedExtensions, label }) {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (allowedMimeTypes.has(file.mimetype) && allowedExtensions.has(ext)) {
      return cb(null, true);
    }
    return cb(new Error(`${label} khong dung dinh dang cho phep.`));
  };
}

export function getUploadDir(folder) {
  return path.join(UPLOAD_ROOT, folder);
}

export function ensureUploadDir(folder) {
  const uploadDir = getUploadDir(folder);
  fs.mkdirSync(uploadDir, { recursive: true });
  return uploadDir;
}

export function createUploadStorage(folder, filenamePrefix = '') {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        cb(null, ensureUploadDir(folder));
      } catch (error) {
        cb(error);
      }
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, filenamePrefix + uniqueSuffix + path.extname(file.originalname || ''));
    }
  });
}

export function createImageUpload(storage, maxSize = IMAGE_UPLOAD_LIMIT) {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: createFileFilter({
      allowedMimeTypes: IMAGE_MIME_TYPES,
      allowedExtensions: IMAGE_EXTENSIONS,
      label: 'Anh upload',
    }),
  });
}

export function createCvUpload(storage, maxSize = CV_UPLOAD_LIMIT) {
  return multer({
    storage,
    limits: { fileSize: maxSize },
    fileFilter: createFileFilter({
      allowedMimeTypes: CV_MIME_TYPES,
      allowedExtensions: CV_EXTENSIONS,
      label: 'CV upload',
    }),
  });
}

export function runSingleUpload(upload, fieldName) {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (error) => {
      if (!error) return next();

      if (error instanceof multer.MulterError) {
        const message = error.code === 'LIMIT_FILE_SIZE'
          ? 'File vuot qua dung luong toi da cho phep.'
          : 'File upload khong hop le.';
        return res.status(400).json({ error: message });
      }

      return res.status(400).json({ error: error.message || 'File upload khong hop le.' });
    });
  };
}
