
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Loader2 } from 'lucide-react';

export default function AdminProtectedRoute({ children }) {
  const { adminUser, loading, isAdmin } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or not admin - redirect to admin login
  if (!adminUser || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
