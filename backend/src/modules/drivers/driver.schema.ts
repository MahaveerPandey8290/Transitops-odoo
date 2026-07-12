import { z } from 'zod';
import { DriverStatus, LicenseCategory } from '@prisma/client';

export const createDriverSchema = z.object({
  name: z.string().min(1).max(100),
  licenseNumber: z.string().min(1).max(30),
  licenseCategory: z.nativeEnum(LicenseCategory),
  licenseExpiryDate: z.string().datetime({ message: 'licenseExpiryDate must be ISO 8601' }),
  phone: z.string().min(7).max(20),
  safetyScore: z.number().int().min(0).max(100).default(100),
  status: z.nativeEnum(DriverStatus).default('AVAILABLE'),
  region: z.string().min(1).max(100),
});

export const updateDriverSchema = createDriverSchema.partial();

export const driverQuerySchema = z.object({
  status: z.nativeEnum(DriverStatus).optional(),
  region: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
export type DriverQuery = z.infer<typeof driverQuerySchema>;
