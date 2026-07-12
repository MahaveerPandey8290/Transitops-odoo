import { Prisma } from '@prisma/client';
import db from '../../config/db';
import { AppError } from '../../utils/apiError';
import {
  CreateFuelLogInput,
  FuelLogQuery,
  CreateExpenseInput,
  ExpenseQuery,
} from './fuelExpense.schema';

// ─── Fuel Logs ─────────────────────────────────────────────────────────────────

export async function listFuelLogs(query: FuelLogQuery) {
  const { vehicleId, tripId, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.FuelLogWhereInput = {
    ...(vehicleId && { vehicleId }),
    ...(tripId && { tripId }),
  };

  const [logs, total] = await db.$transaction([
    db.fuelLog.findMany({
      where,
      include: { vehicle: { select: { registrationNumber: true } } },
      skip,
      take: limit,
      orderBy: { loggedAt: 'desc' },
    }),
    db.fuelLog.count({ where }),
  ]);

  return { logs, total };
}

export async function createFuelLog(input: CreateFuelLogInput) {
  const vehicle = await db.vehicle.findUnique({ where: { id: input.vehicleId } });
  if (!vehicle) throw new AppError('Vehicle not found', 404, 'NOT_FOUND');

  const liters = new Prisma.Decimal(input.liters);
  const pricePerLiter = new Prisma.Decimal(input.pricePerLiter);
  const totalCost = liters.times(pricePerLiter);

  return db.fuelLog.create({
    data: {
      vehicleId: input.vehicleId,
      tripId: input.tripId ?? null,
      liters,
      pricePerLiter,
      totalCost,
      odometer: new Prisma.Decimal(input.odometer),
      loggedAt: input.loggedAt ? new Date(input.loggedAt) : new Date(),
    },
  });
}

// ─── Expenses ──────────────────────────────────────────────────────────────────

export async function listExpenses(query: ExpenseQuery) {
  const { vehicleId, driverId, category, page, limit } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ExpenseWhereInput = {
    ...(vehicleId && { vehicleId }),
    ...(driverId && { driverId }),
    ...(category && { category }),
  };

  const [expenses, total] = await db.$transaction([
    db.expense.findMany({
      where,
      skip,
      take: limit,
      orderBy: { occurredAt: 'desc' },
    }),
    db.expense.count({ where }),
  ]);

  return { expenses, total };
}

export async function createExpense(input: CreateExpenseInput) {
  return db.expense.create({
    data: {
      vehicleId: input.vehicleId ?? null,
      driverId: input.driverId ?? null,
      category: input.category,
      amount: new Prisma.Decimal(input.amount),
      description: input.description,
      occurredAt: new Date(input.occurredAt),
    },
  });
}
