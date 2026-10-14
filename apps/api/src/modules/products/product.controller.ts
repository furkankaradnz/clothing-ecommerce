import { Request, Response } from 'express';
import { productService } from './product.service';
import { productQuerySchema } from './product.schema';
import { asyncHandler } from '../../common/utils/asyncHandler';

export const productController = {
  // Filtre panelindeki seçenekler (tarz, kesim, renk, beden, fiyat aralığı)
  filters: asyncHandler(async (_req: Request, res: Response) => {
    const data = await productService.getFilterOptions();
    res.json({ success: true, data });
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    // Query string'i doğrula + varsayılanları uygula
    const query = productQuerySchema.parse(req.query);
    const result = await productService.list(query);
    res.json({ success: true, ...result });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.getById(req.params.id);
    res.json({ success: true, data: product });
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.getBySlug(req.params.slug);
    res.json({ success: true, data: product });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.create(req.body);
    res.status(201).json({ success: true, data: product });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.update(req.params.id, req.body);
    res.json({ success: true, data: product });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await productService.remove(req.params.id);
    res.json({ success: true, message: 'Ürün silindi' });
  }),
};
