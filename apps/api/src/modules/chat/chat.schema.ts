import { z } from 'zod';

const messageSchema = z.object({
  role: z.enum(['user', 'model']),
  text: z.string().min(1).max(2000),
});

export const chatSchema = z.object({
  // Sohbet geçmişi (son mesaj kullanıcınınki olmalı)
  messages: z.array(messageSchema).min(1, 'En az bir mesaj gerekli').max(20),
});

export type ChatInput = z.infer<typeof chatSchema>;
