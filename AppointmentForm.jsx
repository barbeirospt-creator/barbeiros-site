import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { appointmentService } from '@/services/appointmentService';

export const AppointmentForm = ({ services, barbershopId }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    serviceName: '',
    date: '',
    time: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedDate = new Date(`${formData.date}T${formData.time}`);
    if (selectedDate < new Date()) {
       toast({ title: "Erro", description: "A data deve ser futura.", variant: "destructive" });
       return;
    }

    setLoading(true);
    try {
      const { error } = await appointmentService.createAppointment({
        ...formData,
        barbershopId
      });

      if (error) throw error;

      toast({ title: "Sucesso!", description: "Agendamento realizado com sucesso!" });
      setFormData({ clientName: '', phone: '', serviceName: '', date: '', time: '' });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao realizar agendamento.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <h3 className="font-bold text-lg mb-4">Marcar Agendamento</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">O seu nome</label>
          <Input 
            required
            value={formData.clientName}
            onChange={e => setFormData({...formData, clientName: e.target.value})}
            placeholder="Nome completo"
          />
        </div>
        
        <div>
           <label className="text-sm font-medium">Serviço</label>
           <select 
             className="w-full rounded-md border border-slate-200 p-2 text-sm bg-white text-gray-900"
             required
             value={formData.serviceName}
             onChange={e => setFormData({...formData, serviceName: e.target.value})}
           >
             <option value="">Selecione um serviço</option>
             {services.map(s => (
               <option key={s.id} value={s.name}>{s.name} - {s.price}€</option>
             ))}
           </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Data</label>
            <Input 
              type="date"
              required
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Hora</label>
            <Input 
              type="time"
              required
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'A agendar...' : 'Confirmar Agendamento'}
        </Button>
      </form>
    </div>
  );
};