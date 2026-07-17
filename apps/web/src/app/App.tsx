import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../features/catalog/HomePage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Sonraki sayfalar buraya eklenecek:
        <Route path="/urun/:slug" element={<ProductDetailPage />} />
        <Route path="/sepet" element={<CartPage />} />
        <Route path="/giris" element={<LoginPage />} />
        */}
        <Route
          path="*"
          element={
            <div className="mx-auto max-w-7xl px-4 py-24 text-center">
              <h1 className="text-2xl font-bold">404 - Sayfa bulunamadı</h1>
            </div>
          }
        />
      </Routes>
    </Layout>
  );
}
