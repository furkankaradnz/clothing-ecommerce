import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { chatApi, ChatMessage } from './chatApi';
import type { Product } from '../../types/product';

interface DisplayMessage {
  role: 'user' | 'model';
  text: string;
  products?: Product[];
}

function formatPrice(n: number) {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<DisplayMessage[]>([
    {
      role: 'model',
      text: 'Merhaba! Size ürün önerebilirim. Örneğin "300 TL altında tişört öner" yazabilirsiniz.',
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = useMutation({
    mutationFn: (history: ChatMessage[]) => chatApi.send(history),
    onSuccess: (res) => {
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: res.reply, products: res.products },
      ]);
    },
    onError: (err: any) => {
      const msg =
        err.response?.data?.message ||
        'Bir hata oluştu. AI servisi yapılandırılmış mı?';
      setMessages((prev) => [...prev, { role: 'model', text: msg }]);
    },
  });

  // Yeni mesajda en alta kaydır
  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, sendMessage.isPending]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || sendMessage.isPending) return;

    const newMessages: DisplayMessage[] = [
      ...messages,
      { role: 'user', text },
    ];
    setMessages(newMessages);
    setInput('');

    // Sadece rol + metin gönder (products'ı gönderme), son 10 mesaj
    const history: ChatMessage[] = newMessages
      .slice(-10)
      .map((m) => ({ role: m.role, text: m.text }));
    sendMessage.mutate(history);
  };

  return (
    <>
      {/* Açma butonu */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Asistanı aç"
        >
          <span className="text-2xl">💬</span>
        </button>
      )}

      {/* Sohbet penceresi */}
      {open && (
        <div className="fixed bottom-0 right-0 z-50 flex h-[500px] w-full flex-col bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-96 sm:rounded-2xl sm:border sm:border-gray-200">
          {/* Başlık */}
          <div className="flex items-center justify-between rounded-t-2xl bg-indigo-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛍️</span>
              <span className="font-medium">Alışveriş Asistanı</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors text-xl leading-none"
              aria-label="Sohbeti kapat"
              title="Kapat"
            >
              ✕
            </button>
          </div>

          {/* Mesajlar */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'ml-auto bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Ürün önerileri */}
                {msg.products && msg.products.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.products.map((product) => {
                      const img =
                        product.images.find((i) => i.isPrimary) ||
                        product.images[0];
                      return (
                        <Link
                          key={product.id}
                          to={`/urun/${product.slug}`}
                          onClick={() => setOpen(false)}
                          className="flex gap-3 rounded-lg border border-gray-200 p-2 hover:border-indigo-400 transition-colors"
                        >
                          <div className="h-14 w-12 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                            {img && (
                              <img
                                src={img.url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-indigo-600">
                              {formatPrice(Number(product.basePrice))}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Ürün araması yapıldı ama sonuç yok */}
                {msg.products && msg.products.length === 0 && msg.role === 'model' && i > 0 && (
                  <p className="mt-1 text-xs text-gray-400">
                    (Bu kritere uygun ürün bulunamadı)
                  </p>
                )}
              </div>
            ))}

            {sendMessage.isPending && (
              <div className="bg-gray-100 max-w-[60%] rounded-2xl px-3 py-2 text-sm text-gray-500">
                Yazıyor...
              </div>
            )}
          </div>

          {/* Giriş */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ne aramıştınız?"
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={sendMessage.isPending}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
