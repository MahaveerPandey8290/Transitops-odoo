import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, created } from '../../utils/apiResponse';
import * as authService from './auth.service';
import { RegisterInput, LoginInput } from './auth.schema';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body as RegisterInput);
  created(res, result, 'Registration successful');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body as LoginInput);
  ok(res, result, 'Login successful');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getMe(req.user!.userId);
  ok(res, user);
});
