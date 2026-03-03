
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { MessageCircle, Loader2, Link as LinkIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { validateWhatsAppNumber } from '@/utils/integrationValidation';

export default function WhatsAppIntegration({ integrations, onConnect, onDisconnect, globalLoading }) {
  const { toast } = useToast();
  const [number, setNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isConnected = integrations?.whatsapp_enabled;

  useEffect(() => {
    if (integrations?.whatsapp_number && isConnected) {
      setNumber(integrations.whatsapp_number);
    } else if (!isConnected) {
      setNumber('');
    }
  }, [integrations, isConnected]);

  const handleConnect = async () => {
    if (typeof onConnect !== 'function') {
      console.error('[WhatsAppIntegration] onConnect não é uma função válida.');
      toast({ variant: 'destructive', title: 'Erro Interno', description: 'Não foi possível completar a ação.' });
      return;
    }

    if (!number || !number.trim()) {
      toast({ variant: 'destructive', title: 'Atenção', description: 'O número de WhatsApp é obrigatório.' });
      return;
    }

    const { isValid, error: validationError, value } = validateWhatsAppNumber(number);
    if (!isValid) {
      toast({ variant: 'destructive', title: 'Número Inválido', description: validationError });
      return;
    }

    setIsSaving(true);
    try {
      const result = await onConnect('whatsapp', { whatsapp_number: value });
      
      if (result?.error) {
        toast({ variant: 'destructive', title: 'Erro ao Salvar', description: result.error.message || 'Falha na comunicação com o servidor.' });
      } else {
        toast({ title: 'Sucesso', description: 'Botão do WhatsApp ativado!' });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erro Inesperado', description: 'Ocorreu uma falha no sistema.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (typeof onDisconnect !== 'function') return;

    if (window.confirm('Desativar o botão de WhatsApp do seu perfil?')) {
      setIsSaving(true);
      try {
        const result = await onDisconnect();
        if (result?.error) {
          toast({ variant: 'destructive', title: 'Erro', description: result.error.message });
        } else {
          setNumber('');
          toast({ title: 'Sucesso', description: 'Botão do WhatsApp desativado.' });
        }
      } catch (err) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao desativar.' });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const cleanNumberForLink = number.replace(/\D/g, '');
  const waLink = `https://wa.me/${cleanNumberForLink}`;
  const isLoading = isSaving || globalLoading;

  return (
    <div className="p-6 border border-gray-800 rounded-xl bg-gray-900/50 hover:bg-gray-900 transition-colors flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${isConnected ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
            <MessageCircle size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">WhatsApp Business</h3>
              {isConnected ? (
                <Badge className="bg-green-500/20 text-green-400 border-none">Ativo</Badge>
              ) : (
                <Badge className="bg-gray-800 text-gray-400 border-none">Inativo</Badge>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1">Permita que clientes contactem via WhatsApp</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <div className="flex-1">
          <Input 
            type="text" 
            placeholder="Nº WhatsApp (Ex: +351912345678)" 
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            disabled={isConnected || isLoading}
            className="w-full bg-black border-gray-800 text-white placeholder:text-gray-600 focus:border-green-500"
          />
        </div>
        <div>
          {isConnected ? (
            <Button variant="outline" onClick={handleDisconnect} disabled={isLoading} className="w-full sm:w-auto text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Desativar
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={isLoading || !number.trim()} className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white border-none">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Ativar WhatsApp
            </Button>
          )}
        </div>
      </div>
      
      {isConnected && cleanNumberForLink && (
        <div className="flex items-center gap-2 mt-2 p-3 bg-black/40 border border-gray-800 rounded-lg">
          <LinkIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-400 flex-1 truncate">{waLink}</span>
          <Button size="sm" variant="ghost" className="h-8 text-green-400 hover:text-green-300 hover:bg-green-500/10" onClick={() => {
            navigator.clipboard.writeText(waLink);
            toast({ description: "Link copiado!" });
          }}>
            Copiar Link
          </Button>
        </div>
      )}
    </div>
  );
}
