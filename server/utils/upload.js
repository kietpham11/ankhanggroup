import multer from 'multer';
import path from 'path';

const MB = 1024 * 1024;

export const IMAGE_UPLOAD_LIMIT = 5 * MB;
export const CV_UPLOAD_LIMIT = 5 * MB;

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
