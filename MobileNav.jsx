
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Users, ShoppingBag, MessageSquare, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Início' },
    { path: '/community', icon: Users, label: 'Comunidade' },
    { path: '/compras-em-grupo', icon: ShoppingBag, label: 'Compras' },
    { path: '/forum', icon: MessageSquare, label: 'Fórum' },
    { path: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 shadow-[0_-4px_20px_rgba(0,0,0,0.8)] pb-safe">
      <div className="flex items-center h-16 px-2 overflow-x-auto snap-x snap-mandatory hide-scrollbar justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          // Use location to manually check if active to handle motion layoutId properly across re-renders
          const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center h-full min-w-[64px] snap-center flex-shrink-0"
            >
              <div className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 ${isActive ? 'text-[#FFD700]' : 'text-gray-500'}`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
              
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-[1px] left-1/2 w-8 h-[2px] bg-[#FFD700] rounded-b-full"
                  style={{ x: '-50%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </nav>
  );
}
