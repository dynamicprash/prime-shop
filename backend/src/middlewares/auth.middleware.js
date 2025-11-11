import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

export const verifyJwt = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization?.split(' ')[1];
    const token = req.cookies?.accessToken || bearerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.sub || decoded._id).select('-password -refreshToken');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: insufficient permissions',
    });
  }
  next();
};


