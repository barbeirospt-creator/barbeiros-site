
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Scissors, AlignLeft, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export default function MobileAppointmentDetail({ appointment, isOpen, onClose, onSave }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cliente_nome: '',
    servico: '',
    data: '',
    hora: '',
    status: 'agendado',
    notes: ''
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        cliente_nome: appointment.cliente_nome || '',
        servico: appointment.servico || '',
        data: appointment.data || '',
        hora: appointment.hora || '',
        status: appointment.status || 'agendado',
        notes: appointment.notes || ''
      });
    } else {
      // Defaults for new appointment
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        cliente_nome: '',
        servico: '',
        data: today,
        hora: '10:00',
        status: 'agendado',
        notes: ''
      });
    }
  }, [appointment, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (appointment?.id) {
        const { error } = await supabase
          .from('tabela_agendamentos')
          .update(formData)
          .eq('id', appointment.id);
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Agendamento atualizado com sucesso.' });
      } else {
        // Create new
        const { error } = await supabase
          .from('tabela_agendamentos')
          .insert([formData]);
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Agendamento criado com sucesso.' });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
      toast({ title: 'Erro', description: 'Ocorreu um erro ao guardar.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja cancelar/eliminar este agendamento?')) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tabela_agendamentos')
        .delete()
        .eq('id', appointment.id);
      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Agendamento eliminado.' });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({ title: 'Erro', description: 'Ocorreu um erro ao eliminar.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-950 border-gray-800 text-white w-[95vw] max-w-md rounded-2xl p-4 sm:p-6 mx-auto mt-4 mb-auto sm:my-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left mb-4">
          <DialogTitle className="text-xl font-bold">
            {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
              <User size={16} /> Cliente
            </label>
            <Input 
              value={formData.cliente_nome}
              onChange={(e) => handleChange('cliente_nome', e.target.value)}
              className="bg-black border-gray-800 focus:border-[#FFD700] min-h-[44px]"
              placeholder="Nome do Cliente"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
              <Scissors size={16} /> Serviço
            </label>
            <Input 
              value={formData.servico}
              onChange={(e) => handleChange('servico', e.target.value)}
              className="bg-black border-gray-800 focus:border-[#FFD700] min-h-[44px]"
              placeholder="Ex: Corte e Barba"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <Calendar size={16} /> Data
              </label>
              <Input 
                type="date"
                value={formData.data}
                onChange={(e) => handleChange('data', e.target.value)}
                className="bg-black border-gray-800 focus:border-[#FFD700] min-h-[44px] w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <Clock size={16} /> Hora
              </label>
              <Input 
                type="time"
                value={formData.hora}
                onChange={(e) => handleChange('hora', e.target.value)}
                className="bg-black border-gray-800 focus:border-[#FFD700] min-h-[44px] w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-sm font-medium">Status</label>
            <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
              <SelectTrigger className="bg-black border-gray-800 min-h-[44px]">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-white">
                <SelectItem value="agendado">Agendado</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-gray-400 text-sm font-medium flex items-center gap-2">
              <AlignLeft size={16} /> Notas
            </label>
            <Textarea 
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="bg-black border-gray-800 focus:border-[#FFD700] resize-none"
              placeholder="Observações adicionais..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-4 sm:space-x-0">
          <div className="flex gap-2 w-full">
            {appointment && (
              <Button 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={loading}
                className="flex-1 min-h-[44px]"
              >
                <Trash2 size={18} className="mr-2" />
                Eliminar
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
              className="flex-1 bg-transparent border-gray-700 hover:bg-gray-800 hover:text-white min-h-[44px]"
            >
              <X size={18} className="mr-2" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={loading || !formData.cliente_nome || !formData.data}
              className="flex-1 bg-[#FFD700] hover:bg-[#FFA500] text-black font-bold min-h-[44px]"
            >
              <Save size={18} className="mr-2" />
              Guardar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
