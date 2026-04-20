import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  allowedRole: 'admin' | 'user';
}

export default function ProtectedRoute({ children, allowedRole }: Props) {
  const { user, token } = useAppSelector(s => s.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
}
