import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, created, paginated } from '../../utils/apiResponse';
import * as vehicleService from './vehicle.service';
import { VehicleQuery } from './vehicle.schema';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as VehicleQuery;
  const { vehicles, total } = await vehicleService.listVehicles(query);
  const { page, limit } = query;
  paginated(res, vehicles, {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

export const available = asyncHandler(async (_req: Request, res: Response) => {
  const vehicles = await vehicleService.listAvailableVehicles();
  ok(res, vehicles);
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await vehicleService.getVehicle(req.params.id);
  ok(res, vehicle);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await vehicleService.createVehicle(req.body);
  created(res, vehicle, 'Vehicle created');
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
  ok(res, vehicle, 'Vehicle updated');
});
