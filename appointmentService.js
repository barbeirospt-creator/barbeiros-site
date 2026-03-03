import { supabase } from '@/lib/supabase';

const mapAppointment = (apt) => ({
  id: apt.id,
  clientName: apt.cliente_nome,
  serviceName: apt.servico,
  date: apt.data,
  time: apt.hora,
  price: apt.preco,
  status: apt.status
});

export const appointmentService = {
  async getAppointmentsByBarbershop(barbeariaId) {
    try {
      const { data, error } = await supabase
        .from('tabela_agendamentos')
        .select('*')
        .eq('barbearia_id', barbeariaId)
        .order('data', { ascending: true })
        .order('hora', { ascending: true });

      if (error) throw error;
      return { data: data.map(mapAppointment), error: null };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return { data: [], error };
    }
  },

  async createAppointment(data) {
    try {
      const dbData = {
        barbearia_id: data.barbershopId,
        cliente_nome: data.clientName,
        servico: data.serviceName,
        data: data.date,
        hora: data.time,
        status: 'pendente'
      };

      const { data: newApt, error } = await supabase
        .from('tabela_agendamentos')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;
      return { data: mapAppointment(newApt), error: null };
    } catch (error) {
      console.error('Error creating appointment:', error);
      return { data: null, error };
    }
  }
};