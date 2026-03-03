import { supabase } from '@/lib/supabase';

const mapBarbershop = (shop) => {
  if (!shop) return null;
  return {
    id: shop.id,
    name: shop.nome,
    description: shop.descricao,
    location: {
      address: shop.localizacao || '',
      city: shop.localizacao ? shop.localizacao.split(',')[0].trim() : '',
      district: shop.localizacao ? shop.localizacao.split(',')[1]?.trim() || '' : '',
      coordinates: [38.7223, -9.1393] // Default placeholder
    },
    logo: shop.logo || 'https://via.placeholder.com/150',
    coverImage: 'https://via.placeholder.com/800x400', // Default cover if not in DB
    rating: parseFloat(shop.avaliacao_media) || 0,
    reviewCount: 0, 
    priceRange: '€€',
    contacts: shop.contactos || {},
    hours: shop.horarios || [],
    created_at: shop.criado_em
  };
};

export const barbershopService = {
  async getBarbershops() {
    try {
      const { data, error } = await supabase
        .from('tabela_barbearias')
        .select('*');
      
      if (error) throw error;
      return { data: data.map(mapBarbershop), error: null };
    } catch (error) {
      console.error('Error fetching barbershops:', error);
      return { data: [], error };
    }
  },

  async getBarbershopById(id) {
    try {
      const { data, error } = await supabase
        .from('tabela_barbearias')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data: mapBarbershop(data), error: null };
    } catch (error) {
      console.error(`Error fetching barbershop ${id}:`, error);
      return { data: null, error };
    }
  },

  async getBarbershopByUserId(userId) {
    try {
      // Find barbershop linked to user
      const { data: userLink, error: linkError } = await supabase
        .from('tabela_usuarios')
        .select('barbearia_id')
        .eq('id', userId)
        .single();

      if (linkError) {
         if (linkError.code === 'PGRST116') return { data: null, error: null };
         throw linkError;
      }
      
      if (!userLink?.barbearia_id) return { data: null, error: null };

      return this.getBarbershopById(userLink.barbearia_id);
    } catch (error) {
      console.error('Error fetching user barbershop:', error);
      return { data: null, error };
    }
  },

  async createBarbershop(data) {
    try {
      const dbData = {
        nome: data.name,
        localizacao: typeof data.location === 'string' ? data.location : `${data.location?.city || ''}, ${data.location?.district || ''}`,
        descricao: data.description,
        logo: data.logo,
        horarios: data.hours,
        contactos: data.contacts,
        avaliacao_media: 0
      };

      const { data: newShop, error } = await supabase
        .from('tabela_barbearias')
        .insert([dbData])
        .select()
        .single();

      if (error) throw error;

      // Link to user if userId provided
      if (data.user_id) {
        await supabase
          .from('tabela_usuarios')
          .insert({ 
            id: data.user_id, 
            email: data.contacts?.email,
            tipo_usuario: 'dono',
            barbearia_id: newShop.id 
          });
      }

      return { data: mapBarbershop(newShop), error: null };
    } catch (error) {
      console.error('Error creating barbershop:', error);
      return { data: null, error };
    }
  },

  async updateBarbershop(id, data) {
    try {
      const dbData = {
        nome: data.name,
        localizacao: typeof data.location === 'string' ? data.location : `${data.location?.city || ''}, ${data.location?.district || ''}`,
        descricao: data.description,
        logo: data.logo,
        horarios: data.hours,
        contactos: data.contacts
      };

      const { data: updated, error } = await supabase
        .from('tabela_barbearias')
        .update(dbData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data: mapBarbershop(updated), error: null };
    } catch (error) {
      console.error('Error updating barbershop:', error);
      return { data: null, error };
    }
  },

  async deleteBarbershop(id) {
    try {
      const { error } = await supabase.from('tabela_barbearias').delete().eq('id', id);
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};