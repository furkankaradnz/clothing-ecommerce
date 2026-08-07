import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useCart } from '../cart/useCart';
import { addressApi } from '../account/addressApi';
import { orderApi } from './orderApi';
import type { PaymentForm } from '../../types/order';

function formatPrice(n: number) {
  return n.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart } = useCart();
  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressApi.list,
  });

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [payment, setPayment] = useState<PaymentForm>({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: '',
  });
  const [error, setError] = useState('');

  const createOrder = useMutation({
    mutationFn: () => orderApi.create(selectedAddress, payment),
    onSuccess: (order) => navigate(`/siparis-basarili/${order.id}`),
    onError: (err: any) =>
      setError(err.response?.data?.message || 'Sipariş oluşturulamadı'),
  });

  // Varsayılan adresi otomatik seç
  if (addresses && addresses.length > 0 && !selectedAddress) {
    const def = addresses.find((a) => a.isDefault) || addresses[0];
    setSelectedAddress(def.id);
  }

  const updatePayment = (field: keyof PaymentForm, value: string) =>
    setPayment((p) => ({ ...p, [field]: value }));

  const inputCls =
    'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none';

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-gray-600">Sepetiniz boş, ödeme yapılamaz.</p>
        <button
          onClick={() => navigate('/urunler')}
          className="mt-4 rounded-md bg-indigo-600 px-6 py-2 text-sm text-white"
        >
          Alışverişe Başla
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ödeme</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sol: adres + ödeme */}
        <div className="lg:col-span-2 space-y-8">
          {/* Adres seçimi */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Teslimat Adresi
            </h2>
            {!addresses || addresses.length === 0 ? (
              <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800">
                Kayıtlı adresiniz yok.{' '}
                <button
                  onClick={() => navigate('/hesap/adresler')}
                  className="font-medium underline"
                >
                  Adres ekleyin
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 ${
                      selectedAddress === addr.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === addr.id}
                      onChange={() => setSelectedAddress(addr.id)}
                      className="mt-1"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {addr.title} — {addr.fullName}
                      </p>
                      <p className="text-gray-600">
                        {addr.fullAddress}, {addr.district}/{addr.city}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </section>

          {/* Ödeme formu (sahte) */}
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Kart Bilgileri
            </h2>
            <div className="rounded-lg border border-gray-200 p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Kart Numarası
                </label>
                <input
                  className={inputCls}
                  placeholder="16 haneli kart numarası"
                  maxLength={16}
                  value={payment.cardNumber}
                  onChange={(e) =>
                    updatePayment('cardNumber', e.target.value.replace(/\D/g, ''))
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Kart Sahibi
                </label>
                <input
                  className={inputCls}
                  value={payment.cardHolder}
                  onChange={(e) => updatePayment('cardHolder', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Son Kullanma (AA/YY)
                  </label>
                  <input
                    className={inputCls}
                    placeholder="12/28"
                    maxLength={5}
                    value={payment.expiry}
                    onChange={(e) => updatePayment('expiry', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">CVV</label>
                  <input
                    className={inputCls}
                    placeholder="123"
                    maxLength={3}
                    value={payment.cvv}
                    onChange={(e) =>
                      updatePayment('cvv', e.target.value.replace(/\D/g, ''))
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-gray-400">
                Bu bir demo ödemedir. Gerçek para çekilmez.
              </p>
            </div>
          </section>
        </div>

        {/* Sağ: sipariş özeti */}
        <div>
          <div className="rounded-lg border border-gray-200 p-6 sticky top-20">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Sipariş Özeti
            </h2>
            <div className="space-y-2 text-sm">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {item.product.name} ({item.variant.size}) x{item.quantity}
                  </span>
                  <span className="text-gray-900">
                    {formatPrice(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 font-semibold">
              <span>Toplam</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
            <button
              onClick={() => {
                setError('');
                if (!selectedAddress) {
                  setError('Lütfen teslimat adresi seçin');
                  return;
                }
                createOrder.mutate();
              }}
              disabled={createOrder.isPending}
              className="mt-6 w-full rounded-md bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {createOrder.isPending ? 'İşleniyor...' : 'Siparişi Tamamla'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
