import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, created, paginated } from '../../utils/apiResponse';
import * as fuelExpenseService from './fuelExpense.service';
import { FuelLogQuery, ExpenseQuery } from './fuelExpense.schema';

export const listFuelLogs = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as FuelLogQuery;
  const { logs, total } = await fuelExpenseService.listFuelLogs(query);
  const { page, limit } = query;
  paginated(res, logs, { total, page, limit, totalPages: Math.ceil(total / limit) });
});

export const createFuelLog = asyncHandler(async (req: Request, res: Response) => {
  const log = await fuelExpenseService.createFuelLog(req.body);
  created(res, log, 'Fuel log created');
});

export const listExpenses = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as ExpenseQuery;
  const { expenses, total } = await fuelExpenseService.listExpenses(query);
  const { page, limit } = query;
  paginated(res, expenses, { total, page, limit, totalPages: Math.ceil(total / limit) });
});

export const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const expense = await fuelExpenseService.createExpense(req.body);
  created(res, expense, 'Expense logged');
});
