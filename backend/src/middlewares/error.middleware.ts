import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/apiError';
import { env } from '../config/env';

// Maps known Prisma error codes to clean HTTP responses.
// P2002 = unique constraint, P2025 = record not found.
function handlePrismaError(err: Prisma.PrismaClientKnownRequestError): {
  status: number;
  message: string;
  code: string;
} {
  switch (err.code) {
    case 'P2002': {
      const field = (err.meta?.target as string[] | undefined)?.[0] ?? 'field';
      return { status: 409, message: `A record with this ${field} already exists`, code: 'DUPLICATE_ENTRY' };
    }
    case 'P2025':
      return { status: 404, message: 'Record not found', code: 'NOT_FOUND' };
    case 'P2003':
      return { status: 400, message: 'Referenced record does not exist', code: 'INVALID_REFERENCE' };
    default:
      return { status: 500, message: 'Database error', code: 'DB_ERROR' };
  }
}

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Operational errors: AppError thrown deliberately from a service
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
    return;
  }

  // Known Prisma errors: map to clean 4xx/5xx without exposing schema details
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const { status, message, code } = handlePrismaError(err);
    res.status(status).json({ success: false, message, code });
    return;
  }

  // Zod validation errors (should be caught by validate middleware, but belt-and-suspenders)
  if (err instanceof ZodError) {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  // Unexpected crash — log full error in dev only, never leak to client
  if (env.NODE_ENV === 'development') {
    console.error(err);
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
