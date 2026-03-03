
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

export function useGroupPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch group buys
      const { data: buysData, error: buysError } = await supabase
        .from('group_buys')
        .select('*');

      if (buysError) throw buysError;

      // Fetch participants for current user to know what they joined
      let userParticipations = {};
      if (user) {
        const { data: partData, error: partError } = await supabase
          .from('group_buy_participants')
          .select('group_buy_id, quantity_ordered')
          .eq('user_id', user.id);

        if (!partError && partData) {
          userParticipations = partData.reduce((acc, curr) => {
            acc[curr.group_buy_id] = curr.quantity_ordered;
            return acc;
          }, {});
        }
      }

      const formattedPurchases = buysData.map(buy => ({
        ...buy,
        userJoinedQuantity: userParticipations[buy.id] || 0,
        hasJoined: !!userParticipations[buy.id]
      }));

      setPurchases(formattedPurchases);
    } catch (err) {
      console.error('Error fetching group purchases:', err);
      setError(err.message);
      toast({
        title: "Erro ao carregar compras",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const joinGroupBuy = async (groupBuyId, quantity) => {
    if (!user) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, inicie sessão para aderir a uma compra.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const { error } = await supabase.rpc('join_group_buy', {
        p_group_buy_id: groupBuyId,
        p_user_id: user.id,
        p_quantity: quantity
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Aderiu à compra em grupo com sucesso.",
      });
      
      await fetchPurchases();
      return true;
    } catch (err) {
      console.error('Error joining group buy:', err);
      toast({
        title: "Erro ao aderir",
        description: err.message,
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    purchases,
    loading,
    error,
    refetch: fetchPurchases,
    joinGroupBuy
  };
}
