import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const updateRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;
