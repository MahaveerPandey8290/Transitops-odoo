import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/apiResponse';
import * as reportsService from './reports.service';

export const kpis = asyncHandler(async (_req: Request, res: Response) => {
  const data = await reportsService.getDashboardKpis();
  ok(res, data, 'Dashboard KPIs');
});

export const fuelEfficiency = asyncHandler(async (_req: Request, res: Response) => {
  const data = await reportsService.getFuelEfficiencyReport();
  ok(res, data, 'Fuel efficiency report');
});

export const fleetUtilization = asyncHandler(async (_req: Request, res: Response) => {
  const data = await reportsService.getFleetUtilizationReport();
  ok(res, data, 'Fleet utilization report');
});

export const operationalCost = asyncHandler(async (_req: Request, res: Response) => {
  const data = await reportsService.getOperationalCostReport();
  ok(res, data, 'Operational cost report');
});

export const vehicleRoi = asyncHandler(async (_req: Request, res: Response) => {
  const data = await reportsService.getVehicleRoiReport();
  ok(res, data, 'Vehicle ROI report');
});

export const exportCsv = asyncHandler(async (_req: Request, res: Response) => {
  const csv = await reportsService.buildCsvExport();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="operational-cost.csv"');
  res.status(200).send(csv);
});
