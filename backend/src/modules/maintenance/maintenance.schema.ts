import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  vehicleId: z.string().cuid(),
  description: z.string().min(1).max(500),
  cost: z.number().min(0).default(0),
});

export const maintenanceQuerySchema = z.object({
  vehicleId: z.string().optional(),
  status: z.enum(['OPEN', 'CLOSED']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
export type MaintenanceQuery = z.infer<typeof maintenanceQuerySchema>;
