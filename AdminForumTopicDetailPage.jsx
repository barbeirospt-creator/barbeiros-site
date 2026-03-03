
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDirectSupabase } from '@/hooks/useDirectSupabase';
import { ArrowLeft, Loader2, Trash2, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminModerationPanel } from '@/components/admin/AdminModerationPanel';
import { supabase } from '@/lib/customSupabaseClient';

export default function AdminForumTopicDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Task 8: Hook updated to fetch separately
  const { fetchTopicDetail, deleteTopic, deleteReply, loading } = useDirectSupabase();
  const [data, setData] = useState(null);
  const [logs, setLogs] = useState([]);

  const loadData = async () => {
    const result = await fetchTopicDetail(id);
    setData(result);
    if (result) {
      // Fetch moderation logs without expansion
      const { data: logData } = await supabase
        .from('forum_moderation')
        .select('*')
        .eq('topic_id', id)
        .order('created_at', { ascending: false });
      
      setLogs(logData || []);
    }
  };

  useEffect(() => { loadData(); }, [id]);

  const handleDelete = async (type, targetId) => {
    if (!window.confirm("Confirmar exclusão?")) return;
    if (type === 'topic') {
      await deleteTopic(targetId);
      navigate('/admin/forum/topics');
    } else {
      await deleteReply(targetId);
      loadData();
    }
  };

  if (loading && !data) return <AdminLayout><div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" /></div></AdminLayout>;
  if (!data) return null;

  const { topic, replies } = data;
  const authorName = topic.profiles?.full_name || topic.profiles?.email || 'Anónimo';

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        <button onClick={() => navigate('/admin/forum/topics')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-2 text-sm">
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">{topic.title}</h1>
                <p className="text-sm text-zinc-500 mt-1">
                  Autor: <span className="text-zinc-300">{authorName}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{topic.status}</Badge>
                <Button variant="destructive" size="sm" onClick={() => handleDelete('topic', topic.id)}><Trash2 className="w-4 h-4 mr-2" /> Apagar</Button>
              </div>
            </div>
            <p className="text-zinc-300 whitespace-pre-wrap">{topic.content}</p>
            <div className="mt-4"><AdminModerationPanel targetId={topic.id} targetType="topic" currentStatus={topic.status} onModerated={loadData} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-medium text-white">Respostas ({replies.length})</h3>
            {replies.map(reply => (
              <div key={reply.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {reply.profiles?.full_name || 'Anónimo'}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {reply.profiles?.email || 'Sem email'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px]">{reply.status}</Badge>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-400" onClick={() => handleDelete('reply', reply.id)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
                <p className="text-zinc-300 text-sm mb-3">{reply.content}</p>
                <AdminModerationPanel targetId={reply.id} targetType="reply" currentStatus={reply.status} onModerated={loadData} />
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-fit">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-yellow-500" /> Logs de Moderação</h3>
            {logs.length === 0 ? <p className="text-sm text-zinc-500">Nenhum registo.</p> : (
              <div className="space-y-3">
                {logs.map(log => (
                  <div key={log.id} className="bg-zinc-950 p-3 rounded border border-zinc-800 text-xs">
                    <p className="text-white font-medium mb-1">Ação: <span className="uppercase text-yellow-400">{log.action}</span></p>
                    {log.reason && <p className="text-zinc-400">Motivo: {log.reason}</p>}
                    <p className="text-zinc-500 mt-2">{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
