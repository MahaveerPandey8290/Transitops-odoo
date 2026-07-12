import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../../config/db';
import { env } from '../../config/env';
import { AppError } from '../../utils/apiError';
import { RegisterInput, LoginInput } from './auth.schema';

const LOCK_THRESHOLD = 5;           // failed attempts before lockout
const LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function signToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export async function register(input: RegisterInput): Promise<{ token: string; user: object }> {
  const existing = await db.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError('Email already registered', 409, 'EMAIL_TAKEN');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await db.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      role: input.role,
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  const token = signToken(user.id, user.role);
  return { token, user };
}

export async function login(input: LoginInput): Promise<{ token: string; user: object }> {
  const user = await db.user.findUnique({ where: { email: input.email } });

  // Generic message prevents email enumeration
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Account lockout check
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
    throw new AppError(
      `Account locked due to too many failed attempts. Try again in ${minutesLeft} minute(s).`,
      423,
      'ACCOUNT_LOCKED'
    );
  }

  const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatch) {
    const attempts = user.failedLoginAttempts + 1;
    const shouldLock = attempts >= LOCK_THRESHOLD;

    await db.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: attempts,
        lockedUntil: shouldLock ? new Date(Date.now() + LOCK_DURATION_MS) : null,
      },
    });

    if (shouldLock) {
      throw new AppError('Too many failed attempts. Account locked for 15 minutes.', 423, 'ACCOUNT_LOCKED');
    }

    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Successful login — reset lockout counters
  await db.user.update({
    where: { id: user.id },
    data: { failedLoginAttempts: 0, lockedUntil: null },
  });

  const token = signToken(user.id, user.role);
  const safeUser = { id: user.id, email: user.email, name: user.name, role: user.role };
  return { token, user: safeUser };
}

export async function getMe(userId: string): Promise<object> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');
  return user;
}
