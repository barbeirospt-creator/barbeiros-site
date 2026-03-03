import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export default function BusinessPhotoGallery({ photos, businessId, onRefresh }) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Client-side Validation: File Type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({ 
        title: 'Formato inválido', 
        description: 'Por favor, selecione uma imagem no formato JPG, PNG ou WEBP.', 
        variant: 'destructive' 
      });
      e.target.value = '';
      return;
    }

    // 2. Client-side Validation: File Size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({ 
        title: 'Ficheiro demasiado grande', 
        description: `O tamanho máximo permitido é de 5MB. O ficheiro selecionado tem ${(file.size / 1024 / 1024).toFixed(2)}MB.`, 
        variant: 'destructive' 
      });
      e.target.value = '';
      return;
    }

    // 3. Client-side Validation: Authentication
    if (!user?.id) {
      toast({ 
        title: 'Sessão inválida', 
        description: 'É necessário ter sessão iniciada para carregar fotos.', 
        variant: 'destructive' 
      });
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      // 4. Construct unique, safe file path
      const fileExt = file.name.split('.').pop() || 'jpg';
      const safeRandomStr = Math.random().toString(36).substring(2, 8);
      const safeFileName = `${Date.now()}-${safeRandomStr}.${fileExt}`;
      const filePath = `${user.id}/${safeFileName}`;

      console.log(`Starting upload to path: ${filePath}`);

      // 5. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('business-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Supabase Storage Error Details:', uploadError);
        throw new Error(uploadError.message || 'Falha ao gravar o ficheiro no servidor (Storage).');
      }

      console.log('Upload successful, fetching public URL...');

      // 6. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-photos')
        .getPublicUrl(filePath);

      console.log(`Public URL obtained: ${publicUrl}`);

      // 7. Save to Database
      const { error: dbError } = await supabase
        .from('business_photos')
        .insert([{
          user_id: user.id,
          business_id: businessId,
          image_url: publicUrl,
          alt_text: file.name,
          display_order: photos.length
        }]);

      if (dbError) {
        console.error('Supabase Database Error Details:', dbError);
        // Se a BD falhar, idealmente devíamos apagar a imagem no storage para não criar "lixo",
        // mas por agora lançamos o erro detalhado.
        throw new Error(dbError.message || 'Falha ao guardar os dados da foto na base de dados.');
      }
      
      console.log('Database insert successful!');
      toast({ title: 'Sucesso', description: 'Foto carregada e adicionada com sucesso!' });
      
      // 8. Refresh the gallery
      onRefresh();
    } catch (err) {
      console.error('Complete upload failure stack:', err);
      toast({ 
        title: 'Erro de Upload', 
        description: err.message || 'Ocorreu um erro inesperado ao fazer o upload.', 
        variant: 'destructive' 
      });
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm('Tem a certeza que deseja eliminar esta foto?')) return;
    
    try {
      const { error } = await supabase.from('business_photos').delete().eq('id', photoId);
      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Foto eliminada com sucesso.' });
      onRefresh();
    } catch (err) {
      console.error('Delete error:', err);
      toast({ title: 'Erro', description: 'Não foi possível eliminar a foto.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Galeria de Fotos</h2>
        <div>
          <input 
            type="file" 
            id="photo-upload" 
            className="hidden" 
            accept="image/jpeg,image/png,image/webp,image/jpg" 
            onChange={handleUpload} 
            disabled={uploading} 
          />
          <label htmlFor="photo-upload">
            <Button asChild disabled={uploading} className="bg-[#FFD700] text-black hover:bg-[#FFA500] cursor-pointer">
              <span>
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                    <span>A carregar...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Plus size={16} className="mr-2" /> 
                    <span>Adicionar Foto</span>
                  </div>
                )}
              </span>
            </Button>
          </label>
        </div>
      </div>

      {photos.length === 0 ? (
        <Card className="bg-black border-gray-800 p-12 text-center text-gray-400 flex flex-col items-center justify-center">
          <p>Nenhuma foto adicionada.</p>
          <p className="text-sm mt-2">Formatos suportados: JPG, PNG, WEBP. Tamanho máximo: 5MB.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
              <img 
                src={photo.image_url} 
                alt={photo.alt_text || "Galeria"} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => handleDelete(photo.id)}
                  title="Eliminar foto"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}