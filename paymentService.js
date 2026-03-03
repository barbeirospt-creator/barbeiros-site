import { supabase } from '@/lib/supabase';

export const paymentService = {
  async createPaymentIntent({ appointmentId, amount, serviceId, barbershopId, customerEmail, userId }) {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { appointmentId, amount, serviceId, barbershopId, customerEmail, userId }
    });
    if (error) throw error;
    return data;
  },

  async createSubscription({ userId, planType, barbershopId, email }) {
    const { data, error } = await supabase.functions.invoke('create-subscription', {
      body: { userId, planType, barbershopId, email }
    });
    if (error) throw error;
    return data;
  },

  async getUserTransactions(userId) {
    const { data, error } = await supabase
      .from('tabela_transacoes')
      .select('*')
      .eq('usuario_id', userId)
      .order('data', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getBarbershopTransactions(barbeariaId) {
    const { data, error } = await supabase
      .from('tabela_transacoes')
      .select('*, tabela_usuarios(email)')
      .eq('barbearia_id', barbeariaId)
      .order('data', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getTransactionById(id) {
     const { data, error } = await supabase
      .from('tabela_transacoes')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }
};