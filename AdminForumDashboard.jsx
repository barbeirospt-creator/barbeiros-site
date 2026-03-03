
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/customSupabaseClient';
import { MessageSquare, MessagesSquare, ShieldAlert, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminForumDashboard() {
  const [stats, setStats] = useState({ topics: 0, replies: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch raw data to calculate stats without JOINs
        const { data: topics } = await supabase.from('forum_topics').select('id, status');
        const { data: replies } = await supabase.from('forum_replies').select('id');
        
        const topicsCount = topics ? topics.length : 0;
        const repliesCount = replies ? replies.length : 0;
        const pendingCount = topics ? topics.filter(t => t.status === 'pending').length : 0;
        
        setStats({ 
          topics: topicsCount, 
          replies: repliesCount, 
          pending: pendingCount 
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <AdminLayout><div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-6">Fórum Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-blue-500/10 rounded-xl"><MessageSquare className="w-8 h-8 text-blue-500" /></div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Total de Tópicos</p>
                <h3 className="text-3xl font-bold text-white">{stats.topics}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-green-500/10 rounded-xl"><MessagesSquare className="w-8 h-8 text-green-500" /></div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Total de Respostas</p>
                <h3 className="text-3xl font-bold text-white">{stats.replies}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-yellow-500/10 rounded-xl"><ShieldAlert className="w-8 h-8 text-yellow-500" /></div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Moderação Pendente</p>
                <h3 className="text-3xl font-bold text-white">{stats.pending}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
