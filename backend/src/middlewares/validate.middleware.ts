import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// Validates req.body against schema; rejects unknown fields; returns 422 with field-level errors.
export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(422).json({
        success: false,
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        errors: (result.error as ZodError).flatten().fieldErrors,
      });
      return;
    }
    req.body = result.data; // replace with parsed (strips unknown fields)
    next();
  };

// For query-param validation
export const validateQuery =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(422).json({
        success: false,
        message: 'Invalid query parameters',
        code: 'VALIDATION_ERROR',
        errors: (result.error as ZodError).flatten().fieldErrors,
      });
      return;
    }
    req.query = result.data as Record<string, string>;
    next();
  };
