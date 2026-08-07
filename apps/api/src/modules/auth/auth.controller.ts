import { Request, Response } from 'express';
import { authService } from './auth.service';
import { asyncHandler } from '../../common/utils/asyncHandler';

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.refresh(req.body.refreshToken);
    res.status(200).json({ success: true, data: result });
  }),

  // Korumalı endpoint - auth middleware'inden geçer
  me: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const user = await authService.getProfile(userId);
    res.status(200).json({ success: true, data: user });
  }),
};
