import { User, createUser, getUserByEmail, verifyPassword, resetLoginAttempts, incrementLoginAttempts, lockUser } from './userService';
import { generateToken } from '../auth';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000;

export interface AuthResult {
  user: User;
  token: string;
}

export async function registerUser(userData: {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'mentor';
  phone?: string;
  bio?: string;
  skills?: string;
}): Promise<AuthResult | { error: string }> {
  const existingUser = await getUserByEmail(userData.email);

  if (existingUser) {
    return { error: 'User with this email already exists' };
  }

  const user = await createUser(userData);

  if (!user) {
    return { error: 'Failed to create user' };
  }

  const token = await generateToken(user);

  return { user, token };
}

export async function authenticateUser(email: string, password: string): Promise<AuthResult | { error: string }> {
  const user = await getUserByEmail(email);

  if (!user) {
    return { error: 'Invalid email or password' };
  }

  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    const remainingTime = Math.ceil((new Date(user.locked_until).getTime() - Date.now()) / 1000 / 60);
    return { error: `Account is locked. Please try again in ${remainingTime} minutes` };
  }

  if (!user.is_active) {
    return { error: 'Your account has been deactivated' };
  }

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    await incrementLoginAttempts(user.id);

    if (user.login_attempts + 1 >= MAX_LOGIN_ATTEMPTS) {
      await lockUser(user.id, LOCK_TIME);
      return { error: 'Too many failed login attempts. Account has been locked for 15 minutes' };
    }

    return { error: 'Invalid email or password' };
  }

  await resetLoginAttempts(user.id);

  const token = await generateToken(user);

  const { password: _, login_attempts: __, locked_until: ___, ...userWithoutSensitiveData } = user;

  return { user: userWithoutSensitiveData, token };
}
