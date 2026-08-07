import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../features/catalog/HomePage';
import CatalogPage from '../features/catalog/CatalogPage';
import CategoryPage from '../features/catalog/CategoryPage';
import ProductDetailPage from '../features/catalog/ProductDetailPage';
import FaqPage from '../features/static/FaqPage';
import AboutPage from '../features/static/AboutPage';
import ContactPage from '../features/static/ContactPage';
import ShippingPage from '../features/static/ShippingPage';
import ReturnsPage from '../features/static/ReturnsPage';
import CartPage from '../features/cart/CartPage';
import AddressesPage from '../features/account/AddressesPage';
import CheckoutPage from '../features/orders/CheckoutPage';
import OrderSuccessPage from '../features/orders/OrderSuccessPage';
import MyOrdersPage from '../features/orders/MyOrdersPage';
import AdminOrdersPage from '../features/admin/AdminOrdersPage';
import AdminProductsPage from '../features/admin/AdminProductsPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        {/* Herkese açık */}
        <Route path="/" element={<HomePage />} />
        <Route path="/urunler" element={<CatalogPage />} />
        <Route path="/kategori/:slug" element={<CategoryPage />} />
        <Route path="/urun/:slug" element={<ProductDetailPage />} />
        <Route path="/sepet" element={<CartPage />} />
        <Route path="/giris" element={<LoginPage />} />
        <Route path="/kayit" element={<RegisterPage />} />
        {/* Statik sayfalar */}
        <Route path="/sss" element={<FaqPage />} />
        <Route path="/hakkimizda" element={<AboutPage />} />
        <Route path="/iletisim" element={<ContactPage />} />
        <Route path="/kargo" element={<ShippingPage />} />
        <Route path="/iade" element={<ReturnsPage />} />

        {/* Giriş gerektiren */}
        <Route
          path="/hesap/adresler"
          element={
            <ProtectedRoute>
              <AddressesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/odeme"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siparis-basarili/:id"
          element={
            <ProtectedRoute>
              <OrderSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/siparislerim"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Sadece admin */}
        <Route
          path="/admin/urunler"
          element={
            <ProtectedRoute requireAdmin>
              <AdminProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/siparisler"
          element={
            <ProtectedRoute requireAdmin>
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />

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
