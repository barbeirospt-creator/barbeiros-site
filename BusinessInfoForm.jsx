import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function BusinessInfoForm({ isOpen, onClose, initialData, onSave }) {
  const [formData, setFormData] = useState({
    business_name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    latitude: '',
    longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData({
        business_name: initialData.business_name || '',
        description: initialData.description || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const updates = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null
    };

    const { error } = await onSave(updates);
    setLoading(false);

    if (error) {
      toast({ title: 'Erro', description: 'Falha ao atualizar informações.', variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso', description: 'Informações atualizadas com sucesso!' });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-gray-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Informações do Negócio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Nome do Negócio</label>
            <Input required value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})} className="bg-gray-900 border-gray-700" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Descrição</label>
            <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-gray-900 border-gray-700 min-h-[100px]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Telefone</label>
              <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-gray-900 border-gray-700" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Email</label>
              <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-gray-900 border-gray-700" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Morada</label>
            <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="bg-gray-900 border-gray-700" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Latitude</label>
              <Input type="number" step="any" value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} className="bg-gray-900 border-gray-700" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Longitude</label>
              <Input type="number" step="any" value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} className="bg-gray-900 border-gray-700" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-700 text-gray-300">Cancelar</Button>
            <Button type="submit" disabled={loading} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
              {loading ? 'A Guardar...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}