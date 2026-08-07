import { Request, Response } from 'express';
import { chatService } from './chat.service';
import { asyncHandler } from '../../common/utils/asyncHandler';

export const chatController = {
  chat: asyncHandler(async (req: Request, res: Response) => {
    const result = await chatService.chat(req.body);
    res.json({ success: true, data: result });
  }),
};
