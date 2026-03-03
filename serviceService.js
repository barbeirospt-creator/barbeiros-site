import { supabase } from '@/lib/supabase';

const mapService = (svc) => ({
  id: svc.id,
  name: svc.nome_servico,
  price: parseFloat(svc.preco),
  duration: svc.duracao,
  description: svc.descricao,
  category: 'Geral' 
});

export const serviceService = {
  async getServicesByBarbershop(barbeariaId) {
    try {
      const { data, error } = await supabase
        .from('tabela_servicos')
        .select('*')
        .eq('barbearia_id', barbeariaId);

      if (error) throw error;
      return { data: data.map(mapService), error: null };
    } catch (error) {
      console.error('Error fetching services:', error);
      return { data: [], error };
    }
  },

  async createService(data) {
    try {
      const dbData = {
        barbearia_id: data.barbershopId,
        nome_servico: data.name,
        preco: data.price,
        duracao: data.duration,
        descricao: data.description || ''
      };

      const { data: newSvc, error } = await supabase
        .from('tabela_servicos')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;
      return { data: mapService(newSvc), error: null };
    } catch (error) {
      console.error('Error creating service:', error);
      return { data: null, error };
    }
  },

  async updateService(id, data) {
    try {
      const dbData = {
        nome_servico: data.name,
        preco: data.price,
        duracao: data.duration,
        descricao: data.description
      };

      const { data: updated, error } = await supabase
        .from('tabela_servicos')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: mapService(updated), error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteService(id) {
    try {
      const { error } = await supabase.from('tabela_servicos').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};