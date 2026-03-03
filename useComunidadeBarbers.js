
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { debugGoogleSync } from '@/utils/debugGoogleSync';

export function useComunidadeBarbers() {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBarbers = useCallback(async () => {
    try {
      debugGoogleSync('1. Starting fetch from profiles table');
      setLoading(true);
      setError(null);
      
      const { data, error: err } = await supabase
        .from('profiles')
        .select('id,email,full_name,avatar_url,bio,city,display_name,role,is_shared,created_at,updated_at,google_business_name,google_business_location,google_business_rating,google_business_reviews_count,google_business_photo,google_business_description,google_business_phone,google_business_website,google_business_link')
        .eq('is_shared', true)
        .order('created_at', { ascending: false });
        
      if (err) throw err;

      debugGoogleSync('2. Successfully fetched profiles', data);
      setBarbers(data || []);
    } catch (err) {
      console.error('Error fetching barbers:', err);
      debugGoogleSync('Fetch Error', err);
      setError(err.message || 'Falha ao conectar com o servidor');
      setBarbers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBarbers();

    debugGoogleSync('Setting up real-time subscription for profiles');
    const profilesSubscription = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
        debugGoogleSync('Real-time profile update received', payload);
        fetchBarbers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(profilesSubscription);
    };
  }, [fetchBarbers]);

  return { 
    barbers, 
    loading, 
    error, 
    refetch: fetchBarbers 
  };
}
