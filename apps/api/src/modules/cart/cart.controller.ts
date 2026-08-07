import { Request, Response } from 'express';
import { cartService } from './cart.service';
import { asyncHandler } from '../../common/utils/asyncHandler';

export const cartController = {
  get: asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.getCart(req.user!.userId);
    res.json({ success: true, data: cart });
  }),

  add: asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.addItem(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: cart });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.updateItem(
      req.user!.userId,
      req.params.itemId,
      req.body.quantity
    );
    res.json({ success: true, data: cart });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.removeItem(
      req.user!.userId,
      req.params.itemId
    );
    res.json({ success: true, data: cart });
  }),

  clear: asyncHandler(async (req: Request, res: Response) => {
    const cart = await cartService.clear(req.user!.userId);
    res.json({ success: true, data: cart });
  }),
};
