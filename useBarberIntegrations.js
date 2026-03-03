
import { useState, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';

const fetchWithTimeout = async (promiseOrFn, ms = 30000, retries = 1) => {
  for (let i = 0; i <= retries; i++) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('Tempo limite de conexão excedido (30s).')), ms);
    });
    try {
      const promise = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;
      const result = await Promise.race([promise, timeoutPromise]);
      clearTimeout(timeoutId);
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      if (i === retries) throw error;
      console.warn(`[useBarberIntegrations] Timeout ou erro, a tentar novamente (${i + 1}/${retries})...`);
    }
  }
};

export function useBarberIntegrations() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchIntegrations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    console.log('[useBarberIntegrations] Iniciando fetchIntegrations para o user:', user.id);
    
    try {
      const fetchQuery = () => supabase
        .from('barber_integrations')
        .select('*')
        .eq('barber_id', user.id)
        .single();

      let { data, error: fetchError } = await fetchWithTimeout(fetchQuery);

      if (fetchError && fetchError.code === 'PGRST116') {
        console.log('[useBarberIntegrations] Perfil não encontrado, criando predefinição...');
        const defaultData = {
          barber_id: user.id,
          google_business_id: null,
          google_business_connected: false,
          whatsapp_number: null,
          whatsapp_enabled: false,
          buk_booking_link: null,
          buk_connected: false,
          google_business_link: null
        };
        
        const insertQuery = () => supabase
          .from('barber_integrations')
          .insert(defaultData)
          .select()
          .single();
          
        const { data: newData, error: insertError } = await fetchWithTimeout(insertQuery);
          
        if (insertError) throw new Error(`Falha ao criar integração padrão: ${insertError.message}`);
        data = newData;
      } else if (fetchError) {
        throw new Error(`Falha ao buscar integrações: ${fetchError.message} (Código: ${fetchError.code})`);
      }
      
      console.log('[useBarberIntegrations] fetchIntegrations sucesso:', data);
      setIntegrations(data);
    } catch (err) {
      console.error('[useBarberIntegrations] Erro em fetchIntegrations:', err);
      setError(err.message);
      toast({
        title: "Erro ao carregar",
        description: err.message || "Não foi possível carregar as integrações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  const updateIntegration = async (updates, integrationName) => {
    if (!user) {
      console.error('[useBarberIntegrations] Utilizador não autenticado ao tentar atualizar', integrationName);
      return { error: new Error('Sessão expirada. Por favor, inicie sessão novamente.') };
    }
    
    console.log(`[useBarberIntegrations] Iniciando atualização no Supabase para ${integrationName}:`, updates);
    setLoading(true);
    
    try {
      const updateQuery = () => supabase
        .from('barber_integrations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('barber_id', user.id)
        .select()
        .single();
        
      const { data, error: updateError } = await fetchWithTimeout(updateQuery);
        
      if (updateError) {
        console.error(`[useBarberIntegrations] Erro Supabase ao atualizar ${integrationName}:`, updateError);
        throw new Error(`Erro na base de dados: ${updateError.message} (Código: ${updateError.code})`);
      }
      
      console.log(`[useBarberIntegrations] Atualização de ${integrationName} sucesso:`, data);
      setIntegrations(data);
      return { data, error: null };
    } catch (err) {
      console.error(`[useBarberIntegrations] Exceção capturada ao atualizar ${integrationName}:`, err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  const connectIntegration = async (integrationName, credentials) => {
    console.log(`[useBarberIntegrations] connectIntegration chamado para: ${integrationName}`, credentials);
    let updates = {};
    if (integrationName === 'google_business') {
      updates = { google_business_id: credentials.google_business_id, google_business_connected: true };
    } else if (integrationName === 'whatsapp') {
      updates = { whatsapp_number: credentials.whatsapp_number, whatsapp_enabled: true };
    } else if (integrationName === 'buk') {
      updates = { 
        buk_booking_link: credentials.link, 
        buk_connected: true 
      };
    } else if (integrationName === 'google_business_link') {
      updates = { google_business_link: credentials.link };
    } else {
      console.error('[useBarberIntegrations] Tipo de integração inválido recebido:', integrationName);
      return { error: new Error(`Tipo de integração desconhecido: ${integrationName}`) };
    }
    
    return await updateIntegration(updates, `${integrationName} (Connect)`);
  };

  const disconnectGoogleBusiness = async () => 
    await updateIntegration({ google_business_id: null, google_business_connected: false }, 'Google Business (Disconnect)');

  const disconnectWhatsApp = async () => 
    await updateIntegration({ whatsapp_number: null, whatsapp_enabled: false }, 'WhatsApp (Disconnect)');

  const disconnectBukAgenda = async () => 
    await updateIntegration({ buk_booking_link: null, buk_connected: false }, 'Página de Marcações (Disconnect)');

  const disconnectGoogleBusinessLink = async () =>
    await updateIntegration({ google_business_link: null }, 'Google Business Link (Disconnect)');

  return {
    integrations,
    loading,
    error,
    fetchIntegrations,
    connectIntegration,
    disconnectGoogleBusiness,
    disconnectWhatsApp,
    disconnectBukAgenda,
    disconnectGoogleBusinessLink
  };
}
