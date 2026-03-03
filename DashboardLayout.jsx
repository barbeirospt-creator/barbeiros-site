import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationBell } from '@/components/NotificationBell';
import { Button } from '@/components/ui/button';
import { 
  Scissors, LayoutDashboard, Calendar, Gift, Megaphone, 
  DollarSign, CreditCard, PieChart, Package, Box, 
  ScrollText, CalendarClock, MessageSquare, Smile, 
  Users, Globe, Calculator, LogOut, Menu, X, Crown,
  User, Settings, Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  {
    category: "Principal",
    items: [
      { name: "Painel de Controlo", icon: LayoutDashboard, path: "/dashboard" },
      { name: "Minha Barbearia", icon: Store, path: "/dashboard/barbershop" },
      { name: "Lembretes", icon: CalendarClock, path: "/reminders" },
      { name: "Fidelidade", icon: Gift, path: "/loyalty" },
      { name: "Lista de Espera", icon: Calendar, path: "/waitlist" },
    ]
  },
  {
    category: "Operacional",
    items: [
      { name: "Estoque", icon: Box, path: "/inventory" },
      { name: "Pacotes", icon: Package, path: "/packages" },
      { name: "Comandas", icon: ScrollText, path: "/commands" },
      { name: "Comissões", icon: Calculator, path: "/commissions" },
    ]
  },
  {
    category: "Financeiro",
    items: [
      { name: "Financeiro", icon: DollarSign, path: "/financial" },
      { name: "Pagamentos", icon: CreditCard, path: "/payments" },
      { name: "Relatórios", icon: PieChart, path: "/reports" },
    ]
  },
  {
    category: "Marketing & Clientes",
    items: [
      { name: "Marketing", icon: Megaphone, path: "/marketing" },
      { name: "Aniversários", icon: Gift, path: "/birthdays" },
      { name: "Mensagens Auto", icon: MessageSquare, path: "/auto-responses" },
      { name: "Pesquisa NPS", icon: Smile, path: "/surveys" },
      { name: "Clube VIP", icon: Users, path: "/customer-club" },
      { name: "Meu Site", icon: Globe, path: "/website-builder" },
    ]
  }
];

export const DashboardLayout = ({ children, title, subtitle }) => {
  const { user, signOut, membershipTier } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-slate-900 text-slate-300 flex-shrink-0 h-screen sticky top-0 overflow-y-auto border-r border-slate-800 hidden md:block"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-8">
                <Scissors className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-white">Barbeiros.pt</span>
              </div>

              <div className="space-y-8">
                {menuItems.map((group, idx) => (
                  <div key={idx}>
                    <h3 className="text-xs uppercase font-bold text-slate-500 mb-3 px-2 tracking-wider">
                      {group.category}
                    </h3>
                    <div className="space-y-1">
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <Link to={item.path} key={item.path}>
                            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive ? 'bg-primary text-slate-900 font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>
                              <item.icon className="w-5 h-5" />
                              <span>{item.name}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-800 mt-auto">
              <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user?.user_metadata?.name || 'Barbeiro'}
                  </p>
                  <p className="text-xs text-slate-400 capitalize truncate">
                    Membro {membershipTier}
                  </p>
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-white">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900">{title}</h1>
              {subtitle && <p className="text-sm text-slate-500 hidden sm:block">{subtitle}</p>}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {membershipTier === 'free' && (
              <Link to="/membership-plans">
                <Button variant="outline" size="sm" className="hidden sm:flex text-yellow-600 border-yellow-500 hover:bg-yellow-50">
                  <Crown className="w-4 h-4 mr-2" />
                  Atualizar para Premium
                </Button>
              </Link>
            )}
            <NotificationBell />
            <Link to="/perfil">
               <Button variant="ghost" size="icon">
                 <Settings className="w-5 h-5 text-slate-600" />
               </Button>
            </Link>
          </div>
        </header>

        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};