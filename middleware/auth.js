import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export function auth(required = true) {
  return async (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      if (!required) return next();
      return res.status(401).json({ message: 'No token' });
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(payload.id);
      if (!user) return res.status(401).json({ message: 'Invalid token user' });
      req.user = user;
      next();
    } catch (e) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

export function isAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
}
