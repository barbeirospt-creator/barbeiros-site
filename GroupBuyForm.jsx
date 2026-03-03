
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGroupBuyManagement } from '@/hooks/useGroupBuyManagement';

export default function GroupBuyForm({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    product_name: '',
    objective: '',
    unit_price: '',
    max_participants: '',
    deadline: ''
  });
  const { createGroupBuy, loading } = useGroupBuyManagement();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product_name || !formData.deadline || !formData.unit_price) {
      toast({ title: 'Erro', description: 'Preencha os campos obrigatórios.', variant: 'destructive' });
      return;
    }

    const { error } = await createGroupBuy({
      title: formData.product_name,
      description: formData.objective,
      unit_price: parseFloat(formData.unit_price),
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
      deadline: new Date(formData.deadline).toISOString(),
      status: 'active'
    });

    if (error) {
      toast({ title: 'Erro', description: 'Falha ao criar compra em grupo.', variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso', description: 'Compra em grupo criada com sucesso!' });
      setFormData({ product_name: '', objective: '', unit_price: '', max_participants: '', deadline: '' });
      if (onSuccess) onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-gray-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Nova Compra em Grupo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nome do Produto *</label>
            <Input name="product_name" value={formData.product_name} onChange={handleChange} required className="bg-gray-900 border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Objetivo / Descrição</label>
            <Input name="objective" value={formData.objective} onChange={handleChange} className="bg-gray-900 border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Preço Unitário (€) *</label>
            <Input name="unit_price" type="number" step="0.01" min="0" value={formData.unit_price} onChange={handleChange} required className="bg-gray-900 border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Máximo Participantes (Opcional)</label>
            <Input name="max_participants" type="number" min="1" value={formData.max_participants} onChange={handleChange} className="bg-gray-900 border-gray-700 text-white" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Prazo *</label>
            <Input name="deadline" type="datetime-local" value={formData.deadline} onChange={handleChange} required className="bg-gray-900 border-gray-700 text-white [color-scheme:dark]" />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-700 text-gray-300 hover:text-white">Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
              {loading ? 'A Criar...' : 'Criar Compra'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
