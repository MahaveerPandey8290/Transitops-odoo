import { Response } from 'express';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const ok = <T>(res: Response, data: T, message = 'OK', status = 200): void => {
  res.status(status).json({ success: true, message, data });
};

export const created = <T>(res: Response, data: T, message = 'Created'): void => {
  res.status(201).json({ success: true, message, data });
};

export const paginated = <T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  message = 'OK'
): void => {
  res.status(200).json({ success: true, message, data, meta });
};
