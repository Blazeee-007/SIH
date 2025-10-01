const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/response');
const { ApiError } = require('../utils/response');
const { generateAccessToken, generateRefreshToken, verifyToken } = require('../utils/jwt');
const {
  createUser,
  getUserByEmail,
  verifyPassword,
  incrementLoginAttempts,
  resetLoginAttempts,
  lockUser
} = require('../models/userModel');
const {
  createRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
  deleteUserRefreshTokens
} = require('../models/refreshTokenModel');
const config = require('../config');

const register = asyncHandler(async (req, res) => {
  const { email, password, name, role, phone, bio, skills } = req.body;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  if (!['student', 'mentor'].includes(role)) {
    throw new ApiError(400, 'Invalid role. Must be either student or mentor');
  }

  const user = await createUser({ email, password, name, role, phone, bio, skills });

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const refreshToken = generateRefreshToken({
    userId: user.id
  });

  await createRefreshToken(user.id, refreshToken, 30 * 24 * 60 * 60);

  sendSuccess(res, 201, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    accessToken,
    refreshToken
  }, 'User registered successfully');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.locked_until && user.locked_until > Date.now()) {
    const remainingTime = Math.ceil((user.locked_until - Date.now()) / 1000 / 60);
    throw new ApiError(403, `Account is locked. Please try again in ${remainingTime} minutes`);
  }

  if (!user.is_active) {
    throw new ApiError(403, 'Your account has been deactivated');
  }

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    await incrementLoginAttempts(user.id);

    if (user.login_attempts + 1 >= config.security.maxLoginAttempts) {
      await lockUser(user.id);
      throw new ApiError(403, 'Too many failed login attempts. Account has been locked for 15 minutes');
    }

    throw new ApiError(401, 'Invalid email or password');
  }

  await resetLoginAttempts(user.id);

  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  const refreshToken = generateRefreshToken({
    userId: user.id
  });

  await createRefreshToken(user.id, refreshToken, 30 * 24 * 60 * 60);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });

  sendSuccess(res, 200, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      bio: user.bio,
      skills: user.skills,
      avatar_url: user.avatar_url
    },
    accessToken
  }, 'Login successful');
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken: refreshTokenFromBody } = req.body;
  const refreshTokenFromCookie = req.cookies.refreshToken;

  const refreshToken = refreshTokenFromBody || refreshTokenFromCookie;

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  const decoded = verifyToken(refreshToken);
  if (!decoded) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const storedToken = await getRefreshToken(refreshToken);
  if (!storedToken) {
    throw new ApiError(401, 'Refresh token not found');
  }

  if (storedToken.expires_at < Math.floor(Date.now() / 1000)) {
    await deleteRefreshToken(refreshToken);
    throw new ApiError(401, 'Refresh token has expired');
  }

  const user = await getUserByEmail(decoded.email || '');
  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  const newAccessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });

  sendSuccess(res, 200, {
    accessToken: newAccessToken
  }, 'Access token refreshed');
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }

  if (req.user) {
    await deleteUserRefreshTokens(req.user.id);
  }

  res.clearCookie('refreshToken');

  sendSuccess(res, 200, null, 'Logged out successfully');
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated');
  }

  const user = await getUserByEmail(req.user.email);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  sendSuccess(res, 200, {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      bio: user.bio,
      skills: user.skills,
      avatar_url: user.avatar_url,
      resume_url: user.resume_url
    }
  });
});

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser
};
