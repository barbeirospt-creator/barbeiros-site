import { supabase } from '@/lib/supabase';

const mapImage = (img) => ({
  id: img.id,
  url: img.url_imagem,
  category: img.tipo,
  description: img.descricao
});

export const imageService = {
  async getImagesByBarbershop(barbeariaId) {
    try {
      const { data, error } = await supabase
        .from('tabela_imagens_barbearia')
        .select('*')
        .eq('barbearia_id', barbeariaId);

      if (error) throw error;
      return { data: data.map(mapImage), error: null };
    } catch (error) {
      console.error('Error fetching images:', error);
      return { data: [], error };
    }
  },

  async uploadImage(barbeariaId, file, tipo = 'galeria', descricao = '') {
    try {
      const fileName = `${barbeariaId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('barbershop-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('barbershop-images')
        .getPublicUrl(fileName);

      const dbData = {
        barbearia_id: barbeariaId,
        url_imagem: publicUrl,
        tipo,
        descricao
      };

      const { data: newImg, error: dbError } = await supabase
        .from('tabela_imagens_barbearia')
        .insert([dbData])
        .select()
        .single();

      if (dbError) throw dbError;
      return { data: mapImage(newImg), error: null };
    } catch (error) {
      console.error('Error uploading image:', error);
      return { data: null, error };
    }
  }
};