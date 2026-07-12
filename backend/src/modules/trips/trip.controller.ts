import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, created, paginated } from '../../utils/apiResponse';
import * as tripService from './trip.service';
import { TripQuery } from './trip.schema';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as TripQuery;
  const { trips, total } = await tripService.listTrips(query);
  const { page, limit } = query;
  paginated(res, trips, { total, page, limit, totalPages: Math.ceil(total / limit) });
});

export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const trip = await tripService.getTrip(req.params.id);
  ok(res, trip);
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const trip = await tripService.createTrip(req.body);
  created(res, trip, 'Trip created as DRAFT');
});

export const dispatch = asyncHandler(async (req: Request, res: Response) => {
  const trip = await tripService.dispatchTrip(req.params.id);
  ok(res, trip, 'Trip dispatched');
});

export const complete = asyncHandler(async (req: Request, res: Response) => {
  const trip = await tripService.completeTrip(req.params.id, req.body);
  ok(res, trip, 'Trip completed');
});

export const cancel = asyncHandler(async (req: Request, res: Response) => {
  const trip = await tripService.cancelTrip(req.params.id);
  ok(res, trip, 'Trip cancelled');
});
