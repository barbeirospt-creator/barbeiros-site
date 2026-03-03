
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ShieldAlert, CheckCircle, Ban, Loader2 } from 'lucide-react';
import { useForumAPI } from '@/hooks/useForumAPI';

export function AdminModerationPanel({ targetId, targetType, currentStatus, onModerated }) {
  const [reason, setReason] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { moderateContent, loading } = useForumAPI();
  const { toast } = useToast();

  const handleAction = async (action) => {
    if (!reason && action !== 'approved') {
      toast({ variant: "destructive", title: "Erro", description: "Motivo obrigatório para bloqueio/flag." });
      return;
    }
    
    if (!window.confirm(`Tem a certeza que deseja aplicar a ação: ${action}?`)) return;

    try {
      await moderateContent(targetId, targetType, action, reason);
      toast({ title: "Sucesso", description: `Conteúdo marcado como ${action}.` });
      setIsOpen(false);
      setReason('');
      if (onModerated) onModerated();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    }
  };

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="border-zinc-700 text-zinc-300 gap-2">
        <ShieldAlert className="w-4 h-4" /> Moderar
      </Button>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg mt-2 space-y-3">
      <h4 className="text-sm font-medium text-white flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-yellow-500" /> 
        Ações de Moderação (Status: {currentStatus})
      </h4>
      <Textarea 
        placeholder="Motivo da moderação (obrigatório para bloquear/flag)..." 
        className="bg-zinc-950 border-zinc-800 text-sm h-20"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        <Button size="sm" disabled={loading || currentStatus === 'approved'} onClick={() => handleAction('approved')} className="bg-green-600 hover:bg-green-700 text-white">
          <CheckCircle className="w-4 h-4 mr-1" /> Aprovar
        </Button>
        <Button size="sm" disabled={loading || currentStatus === 'blocked'} onClick={() => handleAction('blocked')} className="bg-red-600 hover:bg-red-700 text-white">
          <Ban className="w-4 h-4 mr-1" /> Bloquear
        </Button>
        <Button size="sm" disabled={loading || currentStatus === 'flagged'} onClick={() => handleAction('flagged')} className="bg-yellow-600 hover:bg-yellow-700 text-white">
          <ShieldAlert className="w-4 h-4 mr-1" /> Flag
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)} className="text-zinc-400 ml-auto">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
