import { useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export function useProfileSync(user) {
  useEffect(() => {
    if (!user) return;

    const syncProfile = async () => {
      try {
        const { error } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (error && error.code === 'PGRST116') {
          await supabase.from('profiles').insert([{
            id: user.id,
            email: user.email,
            full_name: '',
            display_name: user.email?.split('@')[0] || '',
            bio: '',
            onboarding_completed: false
          }]);
        }
      } catch (err) {
        console.error("Profile sync error:", err);
      }
    };

    syncProfile();
  }, [user]);
}