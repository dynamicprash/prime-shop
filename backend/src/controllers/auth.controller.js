import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { User } from '../models/user.models.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: isProduction,
};

const generateTokens = (user) => {
  const payload = {
    sub: user._id.toString(),
    role: user.role,
  };

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m',
  });

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d',
  });

  return { accessToken, refreshToken };
};

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    throw new ApiError(400, 'Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password +refreshToken');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const responseUser = await User.findById(user._id).select('-password -refreshToken');

  return res
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .status(200)
    .json(new ApiResponse(200, { user: responseUser, accessToken }, 'Logged in successfully'));
});

export const logoutUser = asyncHandler(async (req, res) => {
  if (req.user?._id) {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: false, useFindAndModify: false }
    );
  }

  return res
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .status(200)
    .json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  return res.status(200).json(new ApiResponse(200, req.user, 'Fetched current user'));
});


