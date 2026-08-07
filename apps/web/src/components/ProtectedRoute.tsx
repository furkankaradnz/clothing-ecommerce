import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: ReactNode;
  requireAdmin?: boolean;
}

// Giriş yapmamış kullanıcıyı /giris'e yönlendirir.
// requireAdmin=true ise sadece ADMIN rolüne izin verir.
export default function ProtectedRoute({ children, requireAdmin }: Props) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/giris" replace />;
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
