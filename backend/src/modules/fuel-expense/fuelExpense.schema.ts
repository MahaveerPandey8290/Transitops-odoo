import { z } from 'zod';
import { ExpenseCategory } from '@prisma/client';

export const createFuelLogSchema = z.object({
  vehicleId: z.string().cuid(),
  tripId: z.string().cuid().optional(),
  liters: z.number().positive(),
  pricePerLiter: z.number().positive(),
  odometer: z.number().min(0),
  loggedAt: z.string().datetime().optional(),
});

export const fuelLogQuerySchema = z.object({
  vehicleId: z.string().optional(),
  tripId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const createExpenseSchema = z.object({
  vehicleId: z.string().cuid().optional(),
  driverId: z.string().cuid().optional(),
  category: z.nativeEnum(ExpenseCategory),
  amount: z.number().positive(),
  description: z.string().min(1).max(300),
  occurredAt: z.string().datetime(),
});

export const expenseQuerySchema = z.object({
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  category: z.nativeEnum(ExpenseCategory).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateFuelLogInput = z.infer<typeof createFuelLogSchema>;
export type FuelLogQuery = z.infer<typeof fuelLogQuerySchema>;
export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type ExpenseQuery = z.infer<typeof expenseQuerySchema>;
