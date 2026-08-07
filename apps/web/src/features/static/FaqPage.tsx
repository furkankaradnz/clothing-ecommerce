import { useState } from 'react';

const faqs = [
  {
    q: 'Siparişim ne zaman kargoya verilir?',
    a: 'Siparişleriniz onaylandıktan sonra 1-3 iş günü içinde kargoya verilir. Kargo süreci bölgenize göre 1-4 iş günü sürebilir.',
  },
  {
    q: 'İade ve değişim nasıl yapılır?',
    a: 'Ürünlerinizi teslim aldıktan sonra 14 gün içinde, etiketleri çıkarılmamış ve kullanılmamış olması şartıyla iade edebilirsiniz. İade talebinizi hesabınızdan oluşturabilirsiniz.',
  },
  {
    q: 'Hangi ödeme yöntemlerini kullanabilirim?',
    a: 'Kredi kartı ve banka kartı ile ödeme yapabilirsiniz. Tüm ödemeler güvenli altyapı üzerinden gerçekleştirilir.',
  },
  {
    q: 'Beden değişimi yapabilir miyim?',
    a: 'Evet, stokta uygun beden bulunması durumunda ücretsiz beden değişimi yapabilirsiniz.',
  },
  {
    q: 'Kargo ücreti ne kadar?',
    a: '500 TL ve üzeri alışverişlerde kargo ücretsizdir. Altındaki siparişlerde sabit kargo ücreti uygulanır.',
  },
  {
    q: 'Siparişimi nasıl takip edebilirim?',
    a: 'Giriş yaptıktan sonra "Siparişlerim" sayfasından siparişinizin durumunu (Ödendi, Kargoda, Teslim Edildi) takip edebilirsiniz.',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Sıkça Sorulan Sorular
      </h1>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-lg border border-gray-200">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between px-4 py-4 text-left"
            >
              <span className="font-medium text-gray-900">{faq.q}</span>
              <span className="text-gray-400 text-xl">
                {openIndex === i ? '−' : '+'}
              </span>
            </button>
            {openIndex === i && (
              <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
