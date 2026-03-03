import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function useOnboarding() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOnboarding = useCallback(async () => {
    if (!user) return null;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('onboarding_responses')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveOnboarding = async (formData) => {
    if (!user) return { error: new Error("Not authenticated") };
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('onboarding_responses')
        .upsert({ user_id: user.id, ...formData })
        .select()
        .single();
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { fetchOnboarding, saveOnboarding, loading, error };
}