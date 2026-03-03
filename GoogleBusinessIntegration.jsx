
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Store, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { validateGoogleBusinessId } from '@/utils/integrationValidation';

export default function GoogleBusinessIntegration({ integrations, onConnect, onDisconnect, globalLoading }) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [businessId, setBusinessId] = useState('');

  const isConnected = integrations?.google_business_connected;

  useEffect(() => {
    if (integrations?.google_business_id && isConnected) {
      setBusinessId(integrations.google_business_id);
    } else if (!isConnected) {
      setBusinessId('');
    }
  }, [integrations, isConnected]);

  const handleConnect = async () => {
    if (typeof onConnect !== 'function') {
      console.error('[GoogleBusinessIntegration] onConnect não é uma função válida.');
      toast({ variant: 'destructive', title: 'Erro Interno', description: 'Não foi possível completar a ação. Por favor, recarregue a página.' });
      return;
    }

    if (!businessId || !businessId.trim()) {
      toast({ variant: 'destructive', title: 'Atenção', description: 'O ID do Google Business é obrigatório.' });
      return;
    }

    const { isValid, error: validationError, value } = validateGoogleBusinessId(businessId);
    if (!isValid) {
      toast({ variant: 'destructive', title: 'Dados Inválidos', description: validationError });
      return;
    }
    
    setIsConnecting(true);
    try {
      const result = await onConnect('google_business', { google_business_id: value });
      
      if (result?.error) {
        toast({ variant: 'destructive', title: 'Erro na Conexão', description: result.error.message || 'Falha ao salvar as informações.' });
      } else {
        toast({ title: 'Sucesso', description: 'A sua conta do Google Business foi vinculada!' });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erro de Sistema', description: 'Ocorreu uma falha inesperada.' });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (typeof onDisconnect !== 'function') return;

    if (window.confirm('Deseja realmente desconectar a conta do Google Business?')) {
      setIsConnecting(true);
      try {
        const result = await onDisconnect();
        if (result?.error) {
          toast({ variant: 'destructive', title: 'Erro', description: result.error.message });
        } else {
          setBusinessId('');
          toast({ title: 'Desconectado', description: 'Conta desvinculada com sucesso.' });
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
                <Badge className="bg-green-500/20 text-green-400 border-none">Conectado</Badge>
              ) : (
                <Badge className="bg-gray-800 text-gray-400 border-none">Desconectado</Badge>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1">Sincronize horários e avaliações do Google</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <div className="flex-1">
          <Input 
            type="text" 
            placeholder="ID do Google Business (Ex: 123456789)" 
            value={businessId}
            onChange={(e) => setBusinessId(e.target.value)}
            disabled={isConnected || isLoading}
            className="w-full bg-black border-gray-800 text-white placeholder:text-gray-600 focus:border-blue-500"
          />
        </div>
        <div>
          {isConnected ? (
            <Button variant="outline" onClick={handleDisconnect} disabled={isLoading} className="w-full sm:w-auto text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300">
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Desconectar
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={isLoading || !businessId.trim()} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white border-none">
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Conectar Conta
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
