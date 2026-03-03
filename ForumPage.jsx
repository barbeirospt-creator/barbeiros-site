
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { motion } from "framer-motion";
import { MessageSquare, Clock, Plus, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ForumPage() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTopics() {
      try {
        setLoading(true);
        // Using author_id to profile mapping assuming the schema
        const { data, error } = await supabase
          .from("forum_topics")
          .select("*, profiles:author_id(display_name, avatar_url)")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setTopics(data || []);
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar os tópicos do fórum.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, [toast]);

  const handleAction = () => {
    toast({
      title: "Ação não disponível",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="text-[#FFD700]" /> Fórum Comunitário
          </h1>
          <p className="text-zinc-400 mt-1">Partilhe ideias, tire dúvidas e conecte-se com outros profissionais.</p>
        </div>
        <button 
          onClick={handleAction}
          className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#FFA500] transition-colors"
        >
          <Plus size={18} /> Novo Tópico
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl h-28 animate-pulse"></div>
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl">
            <MessageSquare className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhum tópico encontrado</h3>
            <p className="text-zinc-400 mb-6">Seja o primeiro a iniciar uma discussão!</p>
            <button 
              onClick={handleAction}
              className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#FFA500] transition-colors inline-block"
            >
              Criar Tópico
            </button>
          </div>
        ) : (
          topics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={handleAction}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-[#FFD700]/50 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#FFD700] transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{topic.description}</p>
                  
                  <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
                        {topic.profiles?.avatar_url ? (
                          <img src={topic.profiles.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-zinc-400">{topic.profiles?.display_name?.charAt(0) || '?'}</span>
                        )}
                      </div>
                      {topic.profiles?.display_name || 'Usuário Anónimo'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(topic.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2 text-zinc-500 shrink-0">
                  <span className="flex items-center gap-1.5 text-sm bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800">
                    <Eye className="w-4 h-4" /> {topic.views_count || 0}
                  </span>
                  <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded uppercase tracking-wider font-semibold">
                    {topic.category || 'Geral'}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
