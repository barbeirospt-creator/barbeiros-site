import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const NotificationContext = createContext({});

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock initial notifications since we can't create real tables yet
  const mockNotifications = [
    {
      id: '1',
      type: 'Partnership',
      title: 'Nova Parceria Disponível',
      message: 'Desconto de 20% na BarberSupplies Pro.',
      read: false,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      type: 'Promotion',
      title: 'Promoção de Inverno',
      message: 'Aproveite as taxas reduzidas para membros Premium.',
      read: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    // Simulate fetching notifications
    // In production: fetch from Supabase 'notifications' table
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
    setLoading(false);

    // Real-time subscription setup would go here
    /*
    const subscription = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, payload => {
        const newNotification = payload.new;
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast({
          title: newNotification.title,
          description: newNotification.message,
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
    */
  }, [user, toast]);

  const markAsRead = async (id) => {
    // In production: await supabase.from('notifications').update({ read: true }).eq('id', id);
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = async () => {
    // In production: await supabase.from('notifications').update({ read: true }).eq('user_id', user.id);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = async (id) => {
    // In production: await supabase.from('notifications').delete().eq('id', id);
    setNotifications(prev => {
      const target = prev.find(n => n.id === id);
      if (target && !target.read) {
        setUnreadCount(c => Math.max(0, c - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  };

  const createNotification = async (userId, type, title, message, data = {}) => {
    // In production: await supabase.from('notifications').insert({ ... });
    console.log(`Notification created for ${userId}:`, { type, title, message });
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};