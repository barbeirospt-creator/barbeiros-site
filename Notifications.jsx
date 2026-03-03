import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell, Check, Trash2, Tag, Calendar, MessageSquare, Info } from 'lucide-react';

const getIcon = (type) => {
  switch (type) {
    case 'Promotion': return <Tag className="w-5 h-5 text-green-500" />;
    case 'Partnership': return <MessageSquare className="w-5 h-5 text-blue-500" />;
    case 'Training': return <Calendar className="w-5 h-5 text-purple-500" />;
    default: return <Info className="w-5 h-5 text-slate-500" />;
  }
};

export const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Central de Notificações
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Tudo limpo!</h3>
            <p className="text-slate-500">Não tem notificações novas neste momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl shadow-sm border p-4 flex gap-4 ${notification.read ? 'border-slate-200 opacity-75' : 'border-primary/30 ring-1 ring-primary/10'}`}
              >
                <div className={`p-3 rounded-full h-fit flex-shrink-0 ${notification.read ? 'bg-slate-100' : 'bg-white shadow-sm border border-slate-100'}`}>
                  {getIcon(notification.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-semibold text-slate-900 ${!notification.read && 'text-primary'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-3">{notification.message}</p>
                  
                  <div className="flex gap-2">
                    {!notification.read && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Marcar como lida
                      </button>
                    )}
                    <button 
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs font-medium text-red-500 hover:underline flex items-center gap-1 ml-auto"
                    >
                      <Trash2 className="w-3 h-3" /> Remover
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};