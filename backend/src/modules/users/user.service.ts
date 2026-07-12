import db from '../../config/db';
import { AppError } from '../../utils/apiError';
import { UpdateRoleInput, UserQuery } from './user.schema';

const safeUserSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  // Never return passwordHash, failedLoginAttempts, or lockedUntil to the RBAC screen
} as const;

export async function listUsers(query: UserQuery) {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const [users, total] = await db.$transaction([
    db.user.findMany({ select: safeUserSelect, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    db.user.count(),
  ]);

  return { users, total };
}

export async function updateUserRole(targetId: string, requestingUserId: string, input: UpdateRoleInput) {
  // Fleet Manager cannot demote themselves — avoids locking out the system
  if (targetId === requestingUserId) {
    throw new AppError('You cannot change your own role', 403, 'SELF_ROLE_CHANGE');
  }

  const user = await db.user.findUnique({ where: { id: targetId } });
  if (!user) throw new AppError('User not found', 404, 'NOT_FOUND');

  return db.user.update({
    where: { id: targetId },
    data: { role: input.role },
    select: safeUserSelect,
  });
}
