import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function useGroupBuyManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const getGroupBuys = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('group_buys').select('*');
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.sortBy === 'deadline') {
        query = query.order('deadline', { ascending: true });
      } else if (filters.sortBy === 'participants') {
        query = query.order('current_participants', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroupBuy = async (groupBuyData) => {
    if (!user) return { error: 'Not authenticated' };
    setLoading(true);
    setError(null);
    try {
      const { data, error: insertError } = await supabase
        .from('group_buys')
        .insert([{ ...groupBuyData, created_by: user.id }])
        .select()
        .single();
        
      if (insertError) throw insertError;
      return { data, error: null };
    } catch (err) {
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const joinGroupBuy = async (groupBuyId, quantity) => {
    if (!user) return { error: 'Not authenticated' };
    setLoading(true);
    setError(null);
    try {
      const { error: rpcError } = await supabase.rpc('join_group_buy', {
        p_group_buy_id: groupBuyId,
        p_user_id: user.id,
        p_quantity: quantity
      });

      if (rpcError) {
        // Fallback to JS update if RPC fails (e.g. if the user didn't create the function)
        const { error: insertError } = await supabase
          .from('group_buy_participants')
          .insert([{ group_buy_id: groupBuyId, user_id: user.id, quantity_ordered: quantity }]);
          
        if (insertError) throw insertError;
        
        // Fetch current and update
        const { data: gb } = await supabase.from('group_buys').select('current_participants').eq('id', groupBuyId).maybeSingle();
        if (gb) {
          await supabase.from('group_buys').update({ current_participants: gb.current_participants + quantity }).eq('id', groupBuyId);
        }
      }
      
      return { error: null };
    } catch (err) {
      setError(err.message);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const checkUserJoined = async (groupBuyId) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('group_buy_participants')
        .select('*')
        .eq('group_buy_id', groupBuyId)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error checking user join status:", error);
      }
      return data; // returns null if no row found, or the participation object
    } catch (err) {
      return null;
    }
  };

  return { getGroupBuys, createGroupBuy, joinGroupBuy, checkUserJoined, loading, error };
}