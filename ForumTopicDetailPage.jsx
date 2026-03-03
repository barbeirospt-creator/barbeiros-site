
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { ArrowLeft, Loader2, Clock, Eye, User, MessageCircle, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export default function ForumTopicDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [topic, setTopic] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * TEST CHECKLIST:
   * [x] Topic detail page loads with content
   * [x] Replies display correctly
   * [x] Reply form submits successfully
   * [x] No console errors appear
   */

  const fetchTopicAndReplies = async () => {
    console.log(`[ForumTopicDetail] Fetching details for topic ID: ${id}`);
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Topic
      const { data: topicData, error: topicError } = await supabase
        .from('forum_topics')
        .select('*')
        .eq('id', id)
        .single();
        
      if (topicError) throw topicError;
      if (!topicData) throw new Error("Tópico não encontrado.");

      console.log("[ForumTopicDetail] Topic Data:", topicData);

      // Increment views count (non-blocking)
      supabase.from('forum_topics')
        .update({ views_count: (topicData.views_count || 0) + 1 })
        .eq('id', id)
        .then(() => console.log("[ForumTopicDetail] View count updated"));

      // 2. Fetch Replies
      const { data: repliesData, error: repliesError } = await supabase
        .from('forum_replies')
        .select('*')
        .eq('topic_id', id)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });
        
      if (repliesError) throw repliesError;
      console.log("[ForumTopicDetail] Replies Data:", repliesData);

      // 3. Fetch Profiles for Author and Repliers
      const authorIds = new Set([topicData.author_id, ...(repliesData || []).map(r => r.author_id)].filter(Boolean));
      let profilesMap = {};
      
      if (authorIds.size > 0) {
        console.log("[ForumTopicDetail] Fetching profiles:", Array.from(authorIds));
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(authorIds));
          
        if (!profilesError && profilesData) {
          profilesMap = profilesData.reduce((acc, p) => ({ ...acc, [p.id]: p }), {});
        }
      }

      // Combine Data
      setTopic({
        ...topicData,
        author: profilesMap[topicData.author_id] || { full_name: 'Usuário', email: '' }
      });

      setReplies((repliesData || []).map(r => ({
        ...r,
        author: profilesMap[r.author_id] || { full_name: 'Usuário', email: '' }
      })));

    } catch (err) {
      console.error("[ForumTopicDetail] Error:", err);
      setError(err.message || "Não foi possível carregar o tópico.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTopicAndReplies();
  }, [id]);

  const handleReplySubmit = async () => {
    if (!user) {
      return toast({ variant: "destructive", title: "Erro", description: "Precisa ter sessão iniciada." });
    }
    if (!replyContent.trim()) {
      return toast({ variant: "destructive", title: "Erro", description: "A resposta não pode estar vazia." });
    }

    console.log("[ForumTopicDetail] Submitting reply...");
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('forum_replies').insert([{
        topic_id: id,
        content: replyContent.trim(),
        author_id: user.id,
        status: 'approved'
      }]);

      if (error) throw error;
      
      console.log("[ForumTopicDetail] Reply submitted successfully");
      toast({ title: "Sucesso", description: "A sua resposta foi adicionada." });
      setReplyContent('');
      fetchTopicAndReplies(); // Reload to show new reply
    } catch (err) {
      console.error("[ForumTopicDetail] Error submitting reply:", err);
      toast({ variant: "destructive", title: "Erro", description: "Falha ao enviar resposta." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !topic) {
    return (
      <AppLayout>
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin mb-4" />
          <p className="text-zinc-400">A carregar detalhes do tópico...</p>
        </div>
      </AppLayout>
    );
  }

  if (error || !topic) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-6 flex flex-col items-center justify-center h-[50vh] text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4"/> 
          <h2 className="text-2xl font-bold text-white mb-2">Erro ao carregar</h2>
          <p className="text-zinc-400 mb-6">{error || 'Tópico não encontrado.'}</p>
          <Button onClick={() => navigate('/forum')} className="bg-[#FFD700] text-black">
            Voltar ao Fórum
          </Button>
        </div>
      </AppLayout>
    );
  }

  const topicAuthorName = topic.author?.full_name || topic.author?.email?.split('@')[0] || 'Usuário Anónimo';

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
        <button 
          onClick={() => navigate('/forum')} 
          className="flex items-center gap-2 text-zinc-400 hover:text-[#FFD700] transition-colors w-fit group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          <span className="font-medium">Voltar ao Fórum</span>
        </button>

        {/* Main Topic Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] to-yellow-600"></div>
          
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 uppercase text-[10px] font-bold tracking-wider border-none px-3 py-1">
                {topic.category || 'Geral'}
              </Badge>
              <div className="flex items-center gap-4 text-xs text-zinc-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> 
                  {new Date(topic.created_at).toLocaleString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> {topic.views_count} visualizações
                </span>
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-8 leading-tight">
              {topic.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
              {/* Author Sidebar */}
              <div className="w-full sm:w-48 shrink-0 flex items-center sm:flex-col sm:items-center gap-4 bg-zinc-950/60 p-5 rounded-xl border border-zinc-800/50 self-start">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border-2 border-zinc-700 shadow-md">
                  {topic.author?.avatar_url ? (
                    <img src={topic.author.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-zinc-500" />
                  )}
                </div>
                <div className="text-left sm:text-center overflow-hidden w-full">
                  <p className="text-sm font-bold text-white truncate" title={topicAuthorName}>
                    {topicAuthorName}
                  </p>
                  <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                    Membro da Comunidade
                  </p>
                  <Badge variant="outline" className="mt-2 text-[9px] border-[#FFD700]/30 text-[#FFD700] bg-[#FFD700]/5 uppercase">
                    Autor do Tópico
                  </Badge>
                </div>
              </div>
              
              {/* Topic Content */}
              <div className="flex-1 min-w-0">
                <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-[15px] sm:text-base font-normal">
                  {topic.content}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Replies Section */}
        <div className="space-y-4 pt-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
            <MessageCircle className="w-6 h-6 text-[#FFD700]" /> 
            Respostas <span className="text-zinc-500 font-normal text-base ml-1">({replies.length})</span>
          </h3>
          
          {replies.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800 border-dashed rounded-xl p-8 text-center">
              <p className="text-zinc-400">Ainda não há respostas. Seja o primeiro a ajudar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((reply, index) => {
                const replyAuthorName = reply.author?.full_name || reply.author?.email?.split('@')[0] || 'Usuário';
                const isAuthor = reply.author_id === topic.author_id;
                
                return (
                  <div key={reply.id} className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 shadow-sm relative">
                    {/* Reply Number */}
                    <div className="absolute top-4 right-4 text-xs font-bold text-zinc-700">#{index + 1}</div>
                    
                    <div className="flex items-center sm:flex-col sm:w-32 shrink-0 gap-3 sm:text-center self-start">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden ${isAuthor ? 'border-2 border-[#FFD700]' : 'border border-zinc-700'}`}>
                        {reply.author?.avatar_url ? (
                          <img src={reply.author.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-500" />
                        )}
                      </div>
                      <div className="overflow-hidden w-full text-left sm:text-center">
                        <p className="text-xs sm:text-sm font-semibold text-white truncate" title={replyAuthorName}>
                          {replyAuthorName}
                        </p>
                        {isAuthor && (
                          <span className="text-[10px] text-[#FFD700] font-medium block mt-0.5">Autor</span>
                        )}
                        <p className="text-[10px] text-zinc-500 mt-1">
                          {new Date(reply.created_at).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-zinc-300 text-sm sm:text-[15px] whitespace-pre-wrap leading-relaxed break-words">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Reply Form */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 mt-8 shadow-md">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              Deixe a sua resposta
            </h4>
            {user ? (
              <div className="space-y-4">
                <Textarea 
                  placeholder="Escreva algo útil e respeitoso para a comunidade..." 
                  className="bg-zinc-950 border-zinc-800 min-h-[140px] text-white focus:border-[#FFD700] resize-y"
                  value={replyContent} 
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleReplySubmit} 
                    disabled={isSubmitting || !replyContent.trim()} 
                    className="bg-[#FFD700] text-black hover:bg-[#FFD700]/90 font-semibold px-8 h-11"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Publicar Resposta
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 text-center">
                <p className="text-zinc-400 mb-4">Precisa de iniciar sessão para participar na discussão.</p>
                <Button onClick={() => navigate('/login')} className="bg-zinc-800 text-white hover:bg-zinc-700">
                  Iniciar Sessão
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
