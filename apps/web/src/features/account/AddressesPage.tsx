import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressApi } from './addressApi';

const emptyForm = {
  title: '',
  fullName: '',
  phone: '',
  city: '',
  district: '',
  fullAddress: '',
  zipCode: '',
  isDefault: false,
};

export default function AddressesPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  const { data: addresses, isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: addressApi.list,
  });

  const createMutation = useMutation({
    mutationFn: addressApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
      setForm(emptyForm);
      setShowForm(false);
      setError('');
    },
    onError: (err: any) =>
      setError(err.response?.data?.message || 'Adres eklenemedi'),
  });

  const removeMutation = useMutation({
    mutationFn: addressApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['addresses'] }),
  });

  const update = (field: string, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const inputCls =
    'mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none';

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Adreslerim</h1>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {showForm ? 'İptal' : '+ Yeni Adres'}
        </button>
      </div>

      {/* Yeni adres formu */}
      {showForm && (
        <div className="mb-8 rounded-lg border border-gray-200 p-6 space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-gray-700">Başlık</label>
              <input
                className={inputCls}
                placeholder="Ev, İş..."
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Ad Soyad
              </label>
              <input
                className={inputCls}
                value={form.fullName}
                onChange={(e) => update('fullName', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Telefon</label>
              <input
                className={inputCls}
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Şehir</label>
              <input
                className={inputCls}
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">İlçe</label>
              <input
                className={inputCls}
                value={form.district}
                onChange={(e) => update('district', e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Posta Kodu
              </label>
              <input
                className={inputCls}
                value={form.zipCode}
                onChange={(e) => update('zipCode', e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">
              Açık Adres
            </label>
            <textarea
              className={inputCls}
              rows={2}
              value={form.fullAddress}
              onChange={(e) => update('fullAddress', e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => update('isDefault', e.target.checked)}
            />
            Varsayılan adres yap
          </label>
          <button
            onClick={() => createMutation.mutate(form)}
            disabled={createMutation.isPending}
            className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      )}

      {/* Adres listesi */}
      {isLoading && <p className="text-gray-500">Yükleniyor...</p>}
      {addresses && addresses.length === 0 && !showForm && (
        <p className="text-gray-500">Henüz kayıtlı adresiniz yok.</p>
      )}

      <div className="space-y-4">
        {addresses?.map((addr) => (
          <div
            key={addr.id}
            className="rounded-lg border border-gray-200 p-4 flex justify-between items-start"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{addr.title}</span>
                {addr.isDefault && (
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                    Varsayılan
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-700">{addr.fullName}</p>
              <p className="text-sm text-gray-500">{addr.phone}</p>
              <p className="mt-1 text-sm text-gray-600">
                {addr.fullAddress}, {addr.district}/{addr.city}
              </p>
            </div>
            <button
              onClick={() => removeMutation.mutate(addr.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
