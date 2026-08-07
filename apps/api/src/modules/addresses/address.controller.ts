import { Request, Response } from 'express';
import { addressService } from './address.service';
import { asyncHandler } from '../../common/utils/asyncHandler';

export const addressController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    const addresses = await addressService.list(req.user!.userId);
    res.json({ success: true, data: addresses });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const address = await addressService.create(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: address });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const address = await addressService.update(
      req.user!.userId,
      req.params.id,
      req.body
    );
    res.json({ success: true, data: address });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await addressService.remove(req.user!.userId, req.params.id);
    res.json({ success: true, message: 'Adres silindi' });
  }),
};
