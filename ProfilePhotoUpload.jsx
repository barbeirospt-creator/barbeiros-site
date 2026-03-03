import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Loader2, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProfilePhotoUpload = ({ userId, currentPhotoUrl, onPhotoUploaded }) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected for upload:', { name: file.name, type: file.type, size: file.size });

    // Validate file type (JPG, PNG, WEBP, GIF)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      toast({
        title: 'Formato Inválido',
        description: 'Por favor selecione uma imagem válida (JPG, PNG, WEBP, GIF).',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      toast({
        title: 'Ficheiro muito grande',
        description: 'A imagem deve ter no máximo 5MB.',
        variant: 'destructive',
      });
      return;
    }

    // Create preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    await uploadPhoto(file);
  };

  const uploadPhoto = async (file) => {
    setUploading(true);
    try {
      if (!userId) throw new Error('User ID is missing');

      console.log('Starting upload process to Supabase...');
      
      // Create unique filename structured under user's ID folder
      // This matches the RLS policy: auth.uid()::text = (storage.foldername(name))[1]
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      console.log(`Uploading to path: profile-photos/${filePath}`);

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('Supabase Storage Upload Error:', uploadError);
        if (uploadError.message.includes('not found') || uploadError.statusCode === '404') {
          throw new Error('O bucket "profile-photos" não foi encontrado. Contate o administrador.');
        } else if (uploadError.message.includes('row-level security')) {
          throw new Error('Permissão negada. Verifique as políticas de segurança do bucket.');
        }
        throw uploadError;
      }

      console.log('Upload successful, getting public URL...', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('Generated Public URL:', publicUrl);

      // Update profile with new photo URL
      console.log('Updating user profile table with new URL...');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) {
        console.error('Database Update Error:', updateError);
        throw new Error(`Falha ao guardar a URL no perfil: ${updateError.message}`);
      }

      console.log('Profile updated successfully!');
      toast({
        title: 'Sucesso!',
        description: 'Foto de perfil atualizada com sucesso.',
      });

      if (onPhotoUploaded) {
        onPhotoUploaded(publicUrl);
      }
    } catch (error) {
      console.error('Complete Upload Process Error:', error);
      toast({
        title: 'Erro no Upload',
        description: error.message || 'Falha ao fazer upload da foto. Verifique sua conexão e tente novamente.',
        variant: 'destructive',
      });
      // Reset preview on error to previous state
      setPreviewUrl(currentPhotoUrl);
    } finally {
      setUploading(false);
      // Clear the file input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FFD700] shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-gray-800 to-gray-900">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Foto de perfil"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFD700] to-[#FFA500]">
              <User className="w-16 h-16 text-black" />
            </div>
          )}
        </div>

        {/* Camera overlay on hover */}
        <div 
          className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center cursor-pointer"
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Upload indicator */}
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-75 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/png, image/webp, image/gif"
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        variant="outline"
        className="mt-4 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all duration-300"
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            A Enviar...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Alterar Foto
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 mt-2 text-center">
        JPG, PNG, WEBP ou GIF (máx. 5MB)
      </p>
    </motion.div>
  );
};