
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Store, Loader2, ExternalLink, RefreshCw, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/customSupabaseClient';
import GoogleBusinessBadge from '../community/GoogleBusinessBadge';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { debugGoogleSync } from '@/utils/debugGoogleSync';

export default function GoogleMeuNegocioIntegration({ integrations, onConnect, onDisconnect, globalLoading }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [profileLink, setProfileLink] = useState('');

  const isConnected = !!integrations?.google_business_link;
  const hasSyncedData = !!integrations?.google_business_name;

  useEffect(() => {
    if (integrations?.google_business_link) {
      setProfileLink(integrations.google_business_link);
    } else {
      setProfileLink('');
    }
  }, [integrations, isConnected]);

  const syncGoogleData = async (url) => {
    try {
      debugGoogleSync('1. Starting Edge Function sync-google-meu-negocio', { url });
      const { data, error } = await supabase.functions.invoke('sync-google-meu-negocio', {
        body: { url }
      });

      if (error) {
        debugGoogleSync('Edge Function error', error);
        throw error;
      }
      if (!data?.success) {
        debugGoogleSync('Edge Function returned failure', data);
        throw new Error(data?.error || 'Falha na sincronização');
      }
      
      debugGoogleSync('2. Extracted Google Data from Edge Function', data.data);
      return data.data;
    } catch (err) {
      console.error("Sync error:", err);
      throw new Error("Não foi possível sincronizar os dados. A usar apenas o link.");
    }
  };

  const handleConnect = async () => {
    if (typeof onConnect !== 'function') {
      toast({ variant: 'destructive', title: 'Erro Interno', description: 'Não foi possível completar a ação.' });
      return;
    }

    if (!profileLink || !profileLink.trim()) {
      toast({ variant: 'destructive', title: 'Campo Obrigatório', description: 'O link do seu perfil é necessário.' });
      return;
    }

    try {
      debugGoogleSync('Parsing Google link', { profileLink });
      new URL(profileLink);
      if (!profileLink.startsWith('http://') && !profileLink.startsWith('https://')) {
        throw new Error('O link deve começar com http:// ou https://');
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Link Inválido', description: 'Por favor, insira um URL válido começando com http:// ou https://' });
      return;
    }

    setIsConnecting(true);
    
    let syncedData = {};
    try {
      toast({ title: 'A sincronizar...', description: 'A extrair dados do seu Google Meu Negócio.' });
      syncedData = await syncGoogleData(profileLink);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Aviso', description: err.message });
    }

    try {
      const payload = { 
        google_business_link: profileLink,
        google_business_name: syncedData.google_business_name || null,
        google_business_location: syncedData.google_business_location || null,
        google_business_rating: syncedData.google_business_rating || null,
        google_business_reviews_count: syncedData.google_business_reviews_count || null,
        google_business_photo: syncedData.google_business_photo || null,
        google_business_description: syncedData.google_business_description || null,
        google_business_phone: syncedData.google_business_phone || null,
        google_business_website: syncedData.google_business_website || null
      };
      
      debugGoogleSync('3. Before saving to profiles payload', payload);
      const result = await onConnect('google_business_link', payload);
      
      if (result?.error) {
        debugGoogleSync('Save error via onConnect', result.error);
        toast({ variant: 'destructive', title: 'Erro de Vinculação', description: result.error.message || 'Falha ao guardar o link.' });
      } else {
        if (user) {
           debugGoogleSync('Updating profiles table directly', { userId: user.id, payload });
           const { error: profileError } = await supabase.from('profiles').update({
             google_business_link: payload.google_business_link,
             google_business_name: payload.google_business_name,
             google_business_location: payload.google_business_location,
             google_business_rating: payload.google_business_rating,
             google_business_reviews_count: payload.google_business_reviews_count,
             google_business_photo: payload.google_business_photo,
             google_business_description: payload.google_business_description,
             google_business_phone: payload.google_business_phone,
             google_business_website: payload.google_business_website
           }).eq('id', user.id);

           if (profileError) {
             debugGoogleSync('Profiles table update failed', profileError);
             toast({ variant: 'destructive', title: 'Erro ao guardar no perfil', description: profileError.message });
             throw profileError;
           }
        }
        debugGoogleSync('4. After save completes successfully');
        toast({ title: 'Sucesso', description: 'Perfil Google vinculado e sincronizado com sucesso!' });
      }
    } catch (err) {
      debugGoogleSync('Unexpected error during handleConnect', err);
      toast({ variant: 'destructive', title: 'Erro Inesperado', description: 'Ocorreu uma falha no sistema ao guardar os dados.' });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (typeof onDisconnect !== 'function') return;

    if (window.confirm('Remover o link do seu perfil Google Meu Negócio? Isto limpará todos os dados sincronizados.')) {
      setIsConnecting(true);
      try {
        const result = await onDisconnect();
        if (result?.error) {
          toast({ variant: 'destructive', title: 'Erro', description: result.error.message });
        } else {
          setProfileLink('');
          if (user) {
             await supabase.from('profiles').update({
               google_business_link: null,
               google_business_name: null,
               google_business_location: null,
               google_business_rating: null,
               google_business_reviews_count: null,
               google_business_photo: null,
               google_business_description: null,
               google_business_phone: null,
               google_business_website: null
             }).eq('id', user.id);
          }
          toast({ title: 'Sucesso', description: 'Perfil do Google removido.' });
        }
      } catch (err) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao desconectar.' });
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const isLoading = isConnecting || globalLoading;

  return (
    <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50 hover:bg-gray-900 transition-colors flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${isConnected ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
            <Store size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">Google Meu Negócio</h3>
              {isConnected ? (
                <Badge className="bg-green-500/20 text-green-400 border-none">Vinculado</Badge>
              ) : (
                <Badge className="bg-gray-800 text-gray-400 border-none">Não Vinculado</Badge>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1">Sincronize avaliações, fotos e informações do Google</p>
          </div>
        </div>
      </div>

      {hasSyncedData && isConnected && (
        <div className="bg-black border border-gray-800 rounded-lg p-4 mt-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-300">Dados Sincronizados</h4>
            <GoogleBusinessBadge showText={true} />
          </div>
          <div className="flex gap-4">
            {integrations.google_business_photo && (
              <img 
                src={integrations.google_business_photo} 
                alt="Business" 
                className="w-16 h-16 rounded-md object-cover border border-gray-800"
              />
            )}
            <div className="space-y-1 flex-1">
              <p className="text-white font-medium">{integrations.google_business_name}</p>
              <p className="text-sm text-gray-500">{integrations.google_business_location}</p>
              <div className="flex items-center gap-2">
                <Star className="w-3 h-3 text-[#FFD700] fill-[#FFD700]" />
                <span className="text-xs text-white font-bold">{integrations.google_business_rating}</span>
                <span className="text-xs text-gray-500">({integrations.google_business_reviews_count} avaliações)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 mt-2 items-start sm:items-end">
        <div className="flex-1 w-full space-y-3">
          {isConnected ? (
            <div className="p-3 bg-black border border-gray-800 rounded-md flex items-center justify-between">
              <span className="text-gray-300 truncate mr-4">{profileLink}</span>
              <a 
                href={profileLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#FFD700] hover:text-[#FFA500] flex items-center gap-1 text-sm font-medium flex-shrink-0"
              >
                Abrir <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <Input 
              type="url" 
              placeholder="Cole o link do seu perfil Google Meu Negócio" 
              value={profileLink}
              onChange={(e) => setProfileLink(e.target.value)}
              disabled={isLoading}
              className="w-full bg-black border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FFD700]"
            />
          )}
        </div>
        <div className="w-full sm:w-auto flex gap-2">
          {isConnected ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleConnect} 
                disabled={isLoading} 
                className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 flex-1 sm:flex-none"
              >
                {isConnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Ressincronizar
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDisconnect} 
                disabled={isLoading} 
                className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300 flex-1 sm:flex-none"
              >
                Remover
              </Button>
            </>
          ) : (
            <Button onClick={handleConnect} disabled={isLoading || !profileLink.trim()} className="w-full sm:w-auto bg-[#FFD700] hover:bg-[#FFA500] text-black font-semibold border-none">
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Adicionar e Sincronizar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
