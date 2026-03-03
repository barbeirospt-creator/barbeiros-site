import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Share2, Lock, Loader2 } from 'lucide-react';

export default function ProfileSharingToggle({ userId, initialShared = false }) {
  const [isShared, setIsShared] = useState(initialShared);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = async () => {
    if (!userId) return;
    setLoading(true);
    
    const newValue = !isShared;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_shared: newValue })
        .eq('id', userId);

      if (error) throw error;

      setIsShared(newValue);
      toast({
        title: newValue ? "Perfil Partilhado" : "Perfil Privado",
        description: newValue 
          ? "O seu perfil está agora visível para a comunidade." 
          : "O seu perfil já não está visível para a comunidade.",
      });
    } catch (error) {
      console.error('Error toggling profile sharing:', error);
      toast({
        title: "Erro",
        description: "Não foi possível alterar a visibilidade do perfil.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isShared ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'}`}>
          {isShared ? <Share2 size={20} /> : <Lock size={20} />}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Partilhar Perfil na Comunidade</h4>
          <p className="text-xs text-gray-400 mt-1">
            {isShared 
              ? "O seu perfil está visível na lista de barbeiros da comunidade." 
              : "O seu perfil é privado e não aparece na comunidade."}
          </p>
        </div>
      </div>
      
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 focus:ring-offset-black ${
          isShared ? 'bg-[#FFD700]' : 'bg-gray-700'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        role="switch"
        aria-checked={isShared}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
            isShared ? 'translate-x-5' : 'translate-x-0'
          }`}
        >
          {loading && <Loader2 size={12} className="animate-spin text-gray-400" />}
        </span>
      </button>
    </div>
  );
}