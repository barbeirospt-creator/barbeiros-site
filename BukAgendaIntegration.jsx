
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Link as LinkIcon, Loader2, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { validateBookingLink } from '@/utils/integrationValidation';

export default function BukAgendaIntegration({ integrations, onConnect, onDisconnect, globalLoading }) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [bookingLink, setBookingLink] = useState('');

  const isConnected = integrations?.buk_connected;

  useEffect(() => {
    if (integrations?.buk_booking_link && isConnected) {
      setBookingLink(integrations.buk_booking_link);
    } else if (!isConnected) {
      setBookingLink('');
    }
  }, [integrations, isConnected]);

  const handleConnect = async () => {
    if (typeof onConnect !== 'function') {
      console.error('[BukAgendaIntegration] onConnect não é uma função válida.');
      toast({ variant: 'destructive', title: 'Erro Interno', description: 'Não foi possível completar a ação.' });
      return;
    }

    if (!bookingLink || !bookingLink.trim()) {
      toast({ variant: 'destructive', title: 'Campo Obrigatório', description: 'O link da página de marcações é necessário.' });
      return;
    }

    const { isValid, error: validationError, value } = validateBookingLink(bookingLink);
    if (!isValid) {
      toast({ variant: 'destructive', title: 'Link Inválido', description: validationError });
      return;
    }

    setIsConnecting(true);
    try {
      const result = await onConnect('buk', { link: value });
      
      if (result?.error) {
        toast({ variant: 'destructive', title: 'Erro de Vinculação', description: result.error.message || 'Falha ao guardar o link.' });
      } else {
        toast({ title: 'Sucesso', description: 'A sua página de marcações foi vinculada!' });
      }
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erro Inesperado', description: 'Ocorreu uma falha no sistema.' });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (typeof onDisconnect !== 'function') return;

    if (window.confirm('Remover o link da sua página de marcações?')) {
      setIsConnecting(true);
      try {
        const result = await onDisconnect();
        if (result?.error) {
          toast({ variant: 'destructive', title: 'Erro', description: result.error.message });
        } else {
          setBookingLink('');
          toast({ title: 'Sucesso', description: 'Página de marcações removida.' });
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
          <div className={`p-3 rounded-lg ${isConnected ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-800 text-gray-400'}`}>
            <LinkIcon size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">Página de Marcações Externa</h3>
              {isConnected ? (
                <Badge className="bg-green-500/20 text-green-400 border-none">Vinculado</Badge>
              ) : (
                <Badge className="bg-gray-800 text-gray-400 border-none">Não Vinculado</Badge>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-1">Direcione os clientes para a sua página (Buk, Fresha, Booksy, etc)</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-2 items-start sm:items-end">
        <div className="flex-1 w-full space-y-3">
          {isConnected ? (
            <div className="p-3 bg-black border border-gray-800 rounded-md flex items-center justify-between">
              <span className="text-gray-300 truncate mr-4">{bookingLink}</span>
              <a 
                href={bookingLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 flex items-center gap-1 text-sm font-medium flex-shrink-0"
              >
                Abrir <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <Input 
              type="url" 
              placeholder="Cole o link da sua página de marcações (https://...)" 
              value={bookingLink}
              onChange={(e) => setBookingLink(e.target.value)}
              disabled={isLoading}
              className="w-full bg-black border-gray-800 text-white placeholder:text-gray-600 focus:border-purple-500"
            />
          )}
        </div>
        <div className="w-full sm:w-auto">
          {isConnected ? (
            <Button variant="outline" onClick={handleDisconnect} disabled={isLoading} className="w-full sm:w-auto text-red-400 border-red-500/30 hover:bg-red-500/10 hover:text-red-300">
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Remover
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={isLoading || !bookingLink.trim()} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white border-none">
              {isConnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Adicionar Link
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
