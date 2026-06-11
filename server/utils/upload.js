import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

const MB = 1024 * 1024;
export const IMAGE_UPLOAD_LIMIT = 5 * MB;
export const CV_UPLOAD_LIMIT = 5 * MB;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const CV_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

export function createUploadStorage(folder, filenamePrefix = '') {
  return new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: `ankhang/${folder}`,
      resource_type: 'auto',
    },
  });
}

export function createImageUpload(storage, maxSize = IMAGE_UPLOAD_LIMIT) {
  return multer({
    storage,
    limits: { fileSize: maxSize },
  });
}

export function createCvUpload(storage, maxSize = CV_UPLOAD_LIMIT) {
  return multer({
    storage,
    limits: { fileSize: maxSize },
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
