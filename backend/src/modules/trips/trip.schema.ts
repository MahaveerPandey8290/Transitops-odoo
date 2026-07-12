import { z } from 'zod';
import { TripStatus } from '@prisma/client';

export const createTripSchema = z.object({
  vehicleId: z.string().cuid(),
  driverId: z.string().cuid(),
  origin: z.string().min(1).max(200),
  destination: z.string().min(1).max(200),
  cargoWeightKg: z.number().positive(),
  plannedDistanceKm: z.number().positive(),
  revenue: z.number().min(0).default(0),
  scheduledAt: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

export const completeTripSchema = z.object({
  finalOdometerKm: z.number().positive(),
  fuelLiters: z.number().positive(),
  pricePerLiter: z.number().positive(),
});

export const tripQuerySchema = z.object({
  status: z.nativeEnum(TripStatus).optional(),
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type CompleteTripInput = z.infer<typeof completeTripSchema>;
export type TripQuery = z.infer<typeof tripQuerySchema>;
