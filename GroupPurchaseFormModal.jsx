
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { useDirectSupabase } from '@/hooks/useDirectSupabase';

export function GroupPurchaseFormModal({ isOpen, onClose, onSuccess }) {
  const { toast } = useToast();
  const { createGroupPurchase, loading } = useDirectSupabase();
  const [formData, setFormData] = useState({
    product_name: '',
    objective: '',
    unit_price: '',
    max_participants: '',
    deadline: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createGroupPurchase({
        product_name: formData.product_name,
        objective: formData.objective,
        unit_price: parseFloat(formData.unit_price),
        max_participants: parseInt(formData.max_participants),
        deadline: new Date(formData.deadline).toISOString(),
        current_participants: 0
      });
      toast({ title: "Sucesso", description: "Compra em grupo criada." });
      setFormData({ product_name: '', objective: '', unit_price: '', max_participants: '', deadline: '' });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: error.message });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Compra em Grupo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nome do Produto</Label>
            <Input required value={formData.product_name} onChange={e => setFormData({...formData, product_name: e.target.value})} className="bg-zinc-900 border-zinc-800" />
          </div>
          <div className="space-y-2">
            <Label>Descrição / Objetivo</Label>
            <Textarea required value={formData.objective} onChange={e => setFormData({...formData, objective: e.target.value})} className="bg-zinc-900 border-zinc-800" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preço Unitário (€)</Label>
              <Input type="number" step="0.01" required value={formData.unit_price} onChange={e => setFormData({...formData, unit_price: e.target.value})} className="bg-zinc-900 border-zinc-800" />
            </div>
            <div className="space-y-2">
              <Label>Máx. Participantes</Label>
              <Input type="number" required value={formData.max_participants} onChange={e => setFormData({...formData, max_participants: e.target.value})} className="bg-zinc-900 border-zinc-800" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Prazo</Label>
            <Input type="datetime-local" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="bg-zinc-900 border-zinc-800" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="border-zinc-700 text-zinc-300">Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
