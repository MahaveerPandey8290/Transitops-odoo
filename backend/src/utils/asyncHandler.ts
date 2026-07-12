import { Request, Response, NextFunction, RequestHandler } from 'express';

// Wraps async route handlers so we never repeat try/catch in controllers.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
