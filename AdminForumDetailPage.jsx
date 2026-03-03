
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useForumAPI } from '@/hooks/useForumAPI';
import { ArrowLeft, Loader2, User, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { AdminModerationPanel } from '@/components/admin/AdminModerationPanel';
import { Badge } from '@/components/ui/badge';

export default function AdminForumDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTopicDetail, deleteReply, loading } = useForumAPI();
  const [data, setData] = useState(null);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const result = await getTopicDetail(id);
      setData(result);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao carregar detalhes." });
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleDeleteReply = async (replyId) => {
    if (!window.confirm("Apagar esta resposta permanentemente?")) return;
    try {
      await deleteReply(replyId);
      toast({ title: "Sucesso", description: "Resposta apagada." });
      loadData();
    } catch (err) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao apagar." });
    }
  };

  if (loading && !data) return (
    <AdminLayout>
      <div className="flex justify-center items-center h-[50vh]"><Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" /></div>
    </AdminLayout>
  );

  if (!data) return null;

  const { topic, replies } = data;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        <button onClick={() => navigate('/admin/forum')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 text-sm">
          <ArrowLeft size={16} /> Voltar à Lista
        </button>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex justify-between items-start gap-4 mb-4">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{topic.title}</h1>
              <Badge variant="outline" className="shrink-0">{topic.status}</Badge>
            </div>
            <p className="text-zinc-300 whitespace-pre-wrap">{topic.content}</p>
            
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-zinc-800 text-xs text-zinc-500">
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {topic.profiles?.full_name}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(topic.created_at).toLocaleString()}</span>
            </div>

            <div className="mt-4">
              <AdminModerationPanel targetId={topic.id} targetType="topic" currentStatus={topic.status} onModerated={loadData} />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium text-white mb-4">Respostas ({replies.length})</h3>
        <div className="space-y-4">
          {replies.map(reply => (
            <div key={reply.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 sm:p-6">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{reply.profiles?.full_name}</span>
                  <span className="text-xs text-zinc-500">{new Date(reply.created_at).toLocaleString()}</span>
                  <Badge variant="outline" className="text-[10px] h-5">{reply.status}</Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300" onClick={() => handleDeleteReply(reply.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-zinc-300 text-sm whitespace-pre-wrap mb-4">{reply.content}</p>
              <AdminModerationPanel targetId={reply.id} targetType="reply" currentStatus={reply.status} onModerated={loadData} />
            </div>
          ))}
          {replies.length === 0 && <p className="text-zinc-500 text-center py-8">Nenhuma resposta encontrada.</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
