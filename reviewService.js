import { supabase } from '@/lib/supabase';

const mapReview = (review) => ({
  id: review.id,
  author: review.cliente_nome || 'Anónimo',
  rating: review.avaliacao,
  comment: review.comentario,
  date: review.data
});

export const reviewService = {
  async getReviewsByBarbershop(barbeariaId) {
    try {
      const { data, error } = await supabase
        .from('tabela_reviews')
        .select('*')
        .eq('barbearia_id', barbeariaId)
        .order('data', { ascending: false });

      if (error) throw error;
      return { data: data.map(mapReview), error: null };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { data: [], error };
    }
  },

  async createReview(data) {
    try {
      const dbData = {
        barbearia_id: data.barbershopId,
        cliente_nome: data.author,
        avaliacao: data.rating,
        comentario: data.comment,
        data: new Date().toISOString()
      };

      const { data: newReview, error } = await supabase
        .from('tabela_reviews')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;
      return { data: mapReview(newReview), error: null };
    } catch (error) {
      console.error('Error creating review:', error);
      return { data: null, error };
    }
  },

  async deleteReview(id) {
    try {
      const { error } = await supabase.from('tabela_reviews').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};