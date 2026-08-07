import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from './authApi';
import { useAuthStore } from '../../store/authStore';

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await authApi.register(form);
      setAuth(result);
      navigate('/');
    } catch (err: any) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        'Kayıt başarısız';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 text-center">
        Kayıt Ol
      </h1>

      <div className="mt-8 space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ad</label>
            <input
              value={form.firstName}
              onChange={(e) => update('firstName', e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Soyad
            </label>
            <input
              value={form.lastName}
              onChange={(e) => update('lastName', e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-posta
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Şifre
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            En az 8 karakter, bir büyük harf ve bir rakam.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Zaten hesabın var mı?{' '}
          <Link to="/giris" className="font-medium text-indigo-600 hover:underline">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}
