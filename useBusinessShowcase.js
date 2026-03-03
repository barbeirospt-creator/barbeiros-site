import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function useBusinessShowcase() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [data, setData] = useState({
    info: null,
    photos: [],
    portfolio: [],
    specialties: [],
    hours: []
  });

  const fetchData = useCallback(async (userId = user?.id) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch Info
      let { data: infoData } = await supabase
        .from('business_info')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!infoData) {
        // Create default if not exists
        const { data: newInfo } = await supabase
          .from('business_info')
          .insert([{ user_id: userId, business_name: 'Minha Barbearia' }])
          .select()
          .single();
        infoData = newInfo;
      }

      const businessId = infoData.id;

      // Fetch related data
      const [photosRes, portfolioRes, specialtiesRes, hoursRes] = await Promise.all([
        supabase.from('business_photos').select('*').eq('business_id', businessId).order('display_order'),
        supabase.from('portfolio_items').select('*').eq('business_id', businessId).order('created_at', { ascending: false }),
        supabase.from('specialties').select('*').eq('business_id', businessId).order('display_order'),
        supabase.from('business_hours').select('*').eq('business_id', businessId)
      ]);

      setData({
        info: infoData,
        photos: photosRes.data || [],
        portfolio: portfolioRes.data || [],
        specialties: specialtiesRes.data || [],
        hours: hoursRes.data || []
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateInfo = async (updates) => {
    if (!data.info?.id) return { error: 'No business info found' };
    const { data: updated, error } = await supabase
      .from('business_info')
      .update(updates)
      .eq('id', data.info.id)
      .select()
      .single();
    if (!error && updated) {
      setData(prev => ({ ...prev, info: updated }));
    }
    return { data: updated, error };
  };

  return { data, loading, error, fetchData, updateInfo };
}