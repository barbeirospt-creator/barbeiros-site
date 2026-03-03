
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, adminUser, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in as admin
  useEffect(() => {
    if (adminUser && isAdmin) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    }
  }, [adminUser, isAdmin, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { user, error: loginError } = await login(email, password);
      
      if (loginError) {
        setError(loginError.message);
        setIsLoading(false);
        return;
      }

      if (user) {
        // Success - navigate to admin dashboard
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      <Helmet>
        <title>Admin Login | Barbeiros.pt</title>
        <meta name="description" content="Admin panel login for Barbeiros.pt" />
      </Helmet>
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FFD700]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md bg-black/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full flex items-center justify-center mb-4 border-2 border-[#FFD700]/20 shadow-lg">
            <Shield className="w-8 h-8 text-[#FFD700]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Painel de Administração</h1>
          <p className="text-gray-400 text-sm">Acesso restrito apenas para administradores.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-400">Login Failed</p>
              <p className="text-xs text-red-300 mt-1">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Administrativo</label>
            <Input 
              type="email" 
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] h-11" 
              placeholder="admin@exemplo.com"
              required 
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Palavra-passe</label>
            <Input 
              type="password" 
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] h-11" 
              placeholder="••••••••"
              required 
              autoComplete="current-password"
              disabled={isLoading}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#FFD700] text-black hover:bg-[#FFA500] font-semibold h-12 mt-6 transition-all duration-200 shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                A verificar credenciais...
              </span>
            ) : (
              'Entrar no Painel'
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-xs text-center text-gray-500">
            Este painel é exclusivo para administradores do sistema Barbeiros.pt
          </p>
        </div>
      </div>
    </div>
  );
}
