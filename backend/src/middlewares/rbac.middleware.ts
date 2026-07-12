import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AppError } from '../utils/apiError';

// Enforces role-based access. Always used after authenticate().
export const requireRole =
  (roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401, 'UNAUTHORIZED');
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        `Access denied — required role: ${roles.join(' or ')}`,
        403,
        'FORBIDDEN'
      );
    }
    next();
  };
