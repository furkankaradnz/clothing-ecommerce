import { Request, Response } from 'express';
import { orderService } from './order.service';
import { asyncHandler } from '../../common/utils/asyncHandler';

export const orderController = {
  // Kullanıcı: sipariş oluştur (checkout)
  create: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.create(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: order });
  }),

  // Kullanıcı: kendi siparişleri
  listMine: asyncHandler(async (req: Request, res: Response) => {
    const orders = await orderService.listMyOrders(req.user!.userId);
    res.json({ success: true, data: orders });
  }),

  // Kullanıcı: tek sipariş detayı
  getMine: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.getMyOrder(
      req.user!.userId,
      req.params.id
    );
    res.json({ success: true, data: order });
  }),

  // Admin: tüm siparişler
  listAll: asyncHandler(async (_req: Request, res: Response) => {
    const orders = await orderService.listAll();
    res.json({ success: true, data: orders });
  }),

  // Admin: durum güncelle
  updateStatus: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.updateStatus(
      req.params.id,
      req.body.status
    );
    res.json({ success: true, data: order });
  }),
};
