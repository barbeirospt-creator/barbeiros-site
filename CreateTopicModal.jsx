
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';

export function CreateTopicModal({ isOpen, onClose, onSuccess }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    content: '', 
    category: 'geral' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[CreateTopicModal] Form submission started", formData);
    
    if (!user) {
      console.error("[CreateTopicModal] User not authenticated");
      return toast({ variant: "destructive", title: "Erro", description: "Precisa ter sessão iniciada." });
    }

    if (formData.title.length < 5 || formData.title.length > 200) {
      return toast({ variant: "destructive", title: "Erro", description: "O título deve ter entre 5 e 200 caracteres." });
    }
    if (formData.description.length < 10 || formData.description.length > 500) {
      return toast({ variant: "destructive", title: "Erro", description: "A descrição deve ter entre 10 e 500 caracteres." });
    }
    if (formData.content.length < 20) {
      return toast({ variant: "destructive", title: "Erro", description: "O conteúdo deve ter pelo menos 20 caracteres." });
    }

    setIsSubmitting(true);
    try {
      console.log("[CreateTopicModal] Inserting topic to Supabase...");
      const { data, error } = await supabase.from('forum_topics').insert([{
        title: formData.title,
        description: formData.description,
        content: formData.content,
        category: formData.category,
        author_id: user.id,
        status: 'approved'
      }]).select();

      if (error) throw error;

      console.log("[CreateTopicModal] Topic created successfully:", data);
      toast({ title: "Sucesso!", description: "O seu tópico foi publicado." });
      setFormData({ title: '', description: '', content: '', category: 'geral' });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("[CreateTopicModal] Error creating topic:", error);
      toast({ variant: "destructive", title: "Erro", description: "Ocorreu um erro ao publicar o tópico." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">Criar Novo Tópico</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-300">Título</Label>
            <Input 
              id="title" 
              required 
              maxLength={200}
              placeholder="Ex: Qual a melhor máquina de corte?"
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="bg-zinc-900 border-zinc-800 text-white focus:border-[#FFD700]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category" className="text-zinc-300">Categoria</Label>
            <select 
              id="category" 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md h-10 px-3 text-sm text-white focus:border-[#FFD700] outline-none"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="geral">Geral</option>
              <option value="dicas">Dicas & Tutoriais</option>
              <option value="equipamento">Equipamento</option>
              <option value="negocio">Gestão de Negócio</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-300">Breve Descrição</Label>
            <Input 
              id="description" 
              required 
              maxLength={500}
              placeholder="Resumo sobre o que vai ser discutido"
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="bg-zinc-900 border-zinc-800 text-white focus:border-[#FFD700]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content" className="text-zinc-300">Conteúdo Completo</Label>
            <Textarea 
              id="content" 
              required 
              minLength={20}
              placeholder="Escreva aqui todos os detalhes do seu tópico..."
              value={formData.content} 
              onChange={e => setFormData({...formData, content: e.target.value})} 
              className="bg-zinc-900 border-zinc-800 min-h-[150px] text-white focus:border-[#FFD700]"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
            <Button type="button" variant="outline" onClick={onClose} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-medium">
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Publicar Tópico
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
