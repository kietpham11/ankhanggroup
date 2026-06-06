import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'golden_land_secret_key_2026';

// Middleware xác thực JWT
export function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Không có token. Vui lòng đăng nhập.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
}

// Middleware chỉ dành cho Admin
export function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Bạn không có quyền truy cập.' });
    }
    next();
  });
}

export function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}
