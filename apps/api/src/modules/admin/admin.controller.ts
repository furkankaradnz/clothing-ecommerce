import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { asyncHandler } from '../../common/utils/asyncHandler';

export const adminController = {
  stats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await adminService.getStats();
    res.json({ success: true, data: stats });
  }),
  users: asyncHandler(async (_req: Request, res: Response) => {
    const users = await adminService.listUsers();
    res.json({ success: true, data: users });
  }),
};
