import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, created, paginated } from '../../utils/apiResponse';
import * as driverService from './driver.service';
import { DriverQuery } from './driver.schema';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as DriverQuery;
  const { drivers, total } = await driverService.listDrivers(query);
  const { page, limit } = query;
  paginated(res, drivers, { total, page, limit, totalPages: Math.ceil(total / limit) });
});

export const available = asyncHandler(async (_req: Request, res: Response) => {
  const drivers = await driverService.listAvailableDrivers();
  ok(res, drivers);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.getDriver(req.params.id);
  ok(res, driver);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.createDriver(req.body);
  created(res, driver, 'Driver created');
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const driver = await driverService.updateDriver(req.params.id, req.body);
  ok(res, driver, 'Driver updated');
});
