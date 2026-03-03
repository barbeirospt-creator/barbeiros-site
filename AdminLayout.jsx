
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { 
  LayoutDashboard, Users,
  Settings, LogOut, Menu, X, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { adminUser, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Barbeiros', path: '/admin/barbeiros', icon: Users },
    { name: 'Fórum Management', path: '/admin/forum', icon: MessageSquare },
    { name: 'Perfis de Usuários', path: '/admin/usuarios', icon: Users },
    { name: 'Utilizadores', path: '/admin/utilizadores', icon: Users },
    { name: 'Configurações', path: '/admin/configuracoes', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-950 flex text-gray-100 font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black border-r border-gray-800 transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <span className="text-xl font-bold text-white">Admin <span className="text-[#FFD700]">Panel</span></span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[#FFD700]/10 text-[#FFD700]' 
                    : 'text-gray-400 hover:bg-gray-900 hover:text-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-black border-b border-gray-800 flex items-center justify-between px-4 sm:px-6">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm font-medium text-gray-300 hidden sm:block">
              {adminUser?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-red-400">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
