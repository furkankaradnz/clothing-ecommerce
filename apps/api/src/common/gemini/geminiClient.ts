import { env } from '../../config/env';
import { AppError } from '../errors/AppError';

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export interface GeminiMessage {
  role: 'user' | 'model';
  text: string;
}

interface GeminiOptions {
  systemInstruction: string;
  messages: GeminiMessage[];
  // JSON çıktısı zorlamak için (structured output)
  jsonMode?: boolean;
}

// Gemini API'sine istek atar, model metnini string olarak döndürür.
export async function callGemini(options: GeminiOptions): Promise<string> {
  if (!env.gemini.apiKey) {
    throw new AppError(
      503,
      'AI servisi yapılandırılmamış (GEMINI_API_KEY eksik)'
    );
  }

  const url = `${BASE_URL}/${env.gemini.model}:generateContent`;

  const body = {
    systemInstruction: {
      parts: [{ text: options.systemInstruction }],
    },
    contents: options.messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    })),
    generationConfig: {
      temperature: 0.4,
      ...(options.jsonMode
        ? { responseMimeType: 'application/json' }
        : {}),
    },
  };

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': env.gemini.apiKey,
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AppError(502, 'AI servisine ulaşılamadı');
  }

  if (!response.ok) {
    // 429 = kota doldu, 400 = hatalı istek vb.
    const detail = await response.text().catch(() => '');
    if (response.status === 429) {
      throw new AppError(429, 'AI servisi kota limiti doldu, biraz sonra deneyin');
    }
    throw new AppError(
      502,
      `AI servisi hatası (${response.status}): ${detail.slice(0, 200)}`
    );
  }

  const data: any = await response.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (!text) {
    throw new AppError(502, 'AI servisinden boş yanıt geldi');
  }

  return text;
}
