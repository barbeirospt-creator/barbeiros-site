import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

export const usePaymentNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createNotification } = useNotifications();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('payment-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'tabela_transacoes',
          filter: `usuario_id=eq.${user.id}`,
        },
        (payload) => {
          const { status, descricao, valor } = payload.new;
          
          if (status === 'completed') {
            toast({
              title: "Pagamento Confirmado!",
              description: `${descricao} no valor de ${valor}€ foi processado com sucesso.`,
              variant: "default", // Success style
            });
            createNotification(user.id, 'payment', 'Pagamento Recebido', `${descricao} confirmado.`);
          } else if (status === 'failed') {
            toast({
              title: "Falha no Pagamento",
              description: `Houve um problema com o pagamento de ${descricao}. Por favor tente novamente.`,
              variant: "destructive",
            });
            createNotification(user.id, 'payment_error', 'Erro no Pagamento', `Falha ao processar ${descricao}.`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast, createNotification]);
};