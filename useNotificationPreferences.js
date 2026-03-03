import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useNotificationPreferences = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultPreferences = {
    push_notifications_enabled: true,
    email_notifications_enabled: true,
    reminder_24h_enabled: true,
    review_notifications_enabled: true,
    subscription_notifications_enabled: true,
  };

  const getPreferences = async () => {
    if (!user) return;
    try {
      let { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Create default preferences if not exist
        const { data: newData, error: createError } = await supabase
          .from('notification_preferences')
          .insert([{ user_id: user.id, ...defaultPreferences }])
          .select()
          .single();
        
        if (createError) throw createError;
        data = newData;
      } else if (error) {
        throw error;
      }

      setPreferences(data);
    } catch (err) {
      console.error('Error fetching notification preferences:', err);
      // Fallback to defaults locally if fetch fails, but don't persist
      setPreferences(defaultPreferences);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPrefs) => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({ user_id: user.id, ...newPrefs, updated_at: new Date().toISOString() })
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      toast({
        title: "Sucesso",
        description: "Preferências de notificação atualizadas.",
      });
      return data;
    } catch (err) {
      console.error('Error updating preferences:', err);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar as preferências.",
        variant: "destructive"
      });
      throw err;
    }
  };

  const isNotificationEnabled = (type) => {
    if (!preferences) return true; // Default to true if loading
    return preferences[type] === true;
  };

  useEffect(() => {
    if (user) {
      getPreferences();
    }
  }, [user]);

  return {
    preferences,
    loading,
    updatePreferences,
    isNotificationEnabled,
    refreshPreferences: getPreferences
  };
};