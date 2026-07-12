import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, created, paginated } from '../../utils/apiResponse';
import * as maintenanceService from './maintenance.service';
import { MaintenanceQuery } from './maintenance.schema';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as MaintenanceQuery;
  const { logs, total } = await maintenanceService.listMaintenanceLogs(query);
  const { page, limit } = query;
  paginated(res, logs, { total, page, limit, totalPages: Math.ceil(total / limit) });
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const log = await maintenanceService.createMaintenanceLog(req.body);
  created(res, log, 'Maintenance log created — vehicle is now IN_SHOP');
});

export const close = asyncHandler(async (req: Request, res: Response) => {
  const log = await maintenanceService.closeMaintenanceLog(req.params.id as string);
  ok(res, log, 'Maintenance log closed');
});
