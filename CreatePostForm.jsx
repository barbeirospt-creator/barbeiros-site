import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';

export default function CreatePostForm({ topicId, onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert([{ topic_id: topicId, user_id: user.id, title, content }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Post criado com sucesso!",
      });
      setTitle('');
      setContent('');
      if (onPostCreated) onPostCreated(data);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
      <h3 className="text-lg font-semibold text-white">Criar novo Post</h3>
      <Input
        placeholder="Título do Post"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="bg-black border-gray-700 text-white"
        disabled={loading}
      />
      <Textarea
        placeholder="Escreva o seu conteúdo aqui..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="bg-black border-gray-700 text-white min-h-[100px]"
        disabled={loading}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !title.trim() || !content.trim()} className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
          Publicar
        </Button>
      </div>
    </form>
  );
}