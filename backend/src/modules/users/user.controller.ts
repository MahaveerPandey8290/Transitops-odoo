import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, paginated } from '../../utils/apiResponse';
import * as userService from './user.service';
import { UserQuery } from './user.schema';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as UserQuery;
  const { users, total } = await userService.listUsers(query);
  const { page, limit } = query;
  paginated(res, users, { total, page, limit, totalPages: Math.ceil(total / limit) });
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateUserRole(req.params.id, req.user!.userId, req.body);
  ok(res, user, 'User role updated');
});
