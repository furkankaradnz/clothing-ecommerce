import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from './authApi';
import { useAuthStore } from '../../store/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await authApi.login({ email, password });
      setAuth(result);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 text-center">
        Giriş Yap
      </h1>

      <div className="mt-8 space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            E-posta
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="ornek@mail.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Şifre
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>

        <p className="text-center text-sm text-gray-600">
          Hesabın yok mu?{' '}
          <Link to="/kayit" className="font-medium text-indigo-600 hover:underline">
            Kayıt ol
          </Link>
        </p>
      </div>
    </div>
  );
}
