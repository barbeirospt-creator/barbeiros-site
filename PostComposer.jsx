import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/customSupabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function PostComposer({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({ title: "Erro", description: "O conteúdo da publicação é obrigatório.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      // The schema for posts table has: id, user_id, content, likes, created_at, updated_at
      // We will insert content. We can prepend the title if it exists.
      const postContent = title.trim() ? `${title.trim()}\n\n${content.trim()}` : content.trim();

      const { data, error } = await supabase
        .from("posts")
        .insert([{ 
          user_id: user.id, 
          content: postContent
        }])
        .select()
        .single();
        
      if (error) {
        console.error("Error creating post:", error);
        throw error;
      }
      
      toast({ title: "Sucesso!", description: "A sua publicação foi criada." });
      setTitle("");
      setContent("");
      if (onPostCreated) onPostCreated(data);
    } catch (error) {
      console.error("PostComposer error:", error);
      toast({ title: "Erro", description: "Falha ao criar publicação. Tente novamente.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-black border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Partilhar com a Comunidade</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            placeholder="Título (Opcional)" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            className="bg-gray-900 border-gray-800 text-white" 
            disabled={isSubmitting} 
          />
          <Textarea
            placeholder="No que está a pensar?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] bg-gray-900 border-gray-800 text-white placeholder:text-gray-500"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
              <Send size={16} className="mr-2" />
              {isSubmitting ? "A Publicar..." : "Publicar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}