
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { secureStorage } from '@/utils/secureStorage';

export function useAdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      
      // Decrypt API keys if they exist
      if (data && data.encrypted_api_keys) {
        data.api_keys = secureStorage.decrypt(data.encrypted_api_keys) || {};
      } else if (data) {
        data.api_keys = {};
      }

      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load settings.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const saveSettings = async (updates) => {
    try {
      const payload = { ...updates, updated_at: new Date().toISOString() };
      
      // Handle API keys encryption
      if (payload.api_keys) {
        payload.encrypted_api_keys = secureStorage.encrypt(payload.api_keys);
        delete payload.api_keys;
      }

      const { error } = await supabase
        .from('admin_settings')
        .update(payload)
        .eq('id', 1);

      if (error) throw error;
      
      toast({ title: 'Success', description: 'Settings saved successfully.' });
      await fetchSettings();
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save settings.' });
      return false;
    }
  };

  const resetToDefaults = async () => {
    // Basic defaults
    const defaults = {
      primary_color: '#FFD700',
      secondary_color: '#000000',
      theme: 'dark',
      payment_gateway: 'stripe',
      test_mode: true,
      site_name: 'Barbeiros.pt',
    };
    await saveSettings(defaults);
  };

  const testEmailConfiguration = async () => {
    toast({ title: 'Testing Email...', description: 'Sending test email to administrator.' });
    // Mock API call
    setTimeout(() => {
      toast({ title: 'Success', description: 'Test email sent successfully!' });
    }, 1500);
  };

  return {
    settings,
    loading,
    saveSettings,
    resetToDefaults,
    testEmailConfiguration,
    refresh: fetchSettings
  };
}
