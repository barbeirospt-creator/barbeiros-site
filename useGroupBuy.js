import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function useGroupBuy() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_buy_opportunities')
        .select('*, group_buy_interests(quantity)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addInterest = async (opportunity_id, quantity) => {
    if (!user) return { error: new Error("Not authenticated") };
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('group_buy_interests')
        .upsert({ opportunity_id, user_id: user.id, quantity })
        .select();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { fetchOpportunities, addInterest, loading, error };
}