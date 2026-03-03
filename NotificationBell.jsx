import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const recentNotifications = notifications.slice(0, 5);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex items-center justify-between px-4 py-2">
          <DropdownMenuLabel className="p-0">Notificações</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-xs text-primary hover:underline"
            >
              Marcar lidas
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        {recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">
            Sem notificações
          </div>
        ) : (
          recentNotifications.map((notification) => (
            <DropdownMenuItem 
              key={notification.id} 
              className={`flex flex-col items-start p-3 cursor-pointer ${!notification.read ? 'bg-slate-50 border-l-2 border-primary' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex justify-between w-full mb-1">
                <span className="font-semibold text-sm">{notification.title}</span>
                <span className="text-xs text-slate-400">
                  {new Date(notification.created_at).toLocaleDateString('pt-PT')}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{notification.message}</p>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <Link to="/notifications" onClick={() => setIsOpen(false)}>
          <DropdownMenuItem className="w-full text-center justify-center text-primary font-medium cursor-pointer">
            Ver todas
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};