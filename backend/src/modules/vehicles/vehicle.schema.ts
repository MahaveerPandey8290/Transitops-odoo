import { z } from 'zod';
import { VehicleStatus, VehicleType } from '@prisma/client';

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1).max(20),
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  year: z.number().int().min(1990).max(new Date().getFullYear() + 1),
  type: z.nativeEnum(VehicleType),
  region: z.string().min(1).max(100),
  maxLoadCapacityKg: z.number().positive(),
  currentOdometerKm: z.number().min(0).default(0),
  purchaseCost: z.number().positive(),
});

export const updateVehicleSchema = createVehicleSchema.partial().extend({
  status: z.nativeEnum(VehicleStatus).optional(),
});

export const vehicleQuerySchema = z.object({
  status: z.nativeEnum(VehicleStatus).optional(),
  type: z.nativeEnum(VehicleType).optional(),
  region: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type VehicleQuery = z.infer<typeof vehicleQuerySchema>;
