
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/customSupabaseClient';
import { ShoppingBag, Users, Loader2, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminGroupPurchasesDashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, participants: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: tCount } = await supabase.from('group_buys').select('*', { count: 'exact', head: true });
        const { count: aCount } = await supabase.from('group_buys').select('*', { count: 'exact', head: true }).eq('status', 'active');
        const { data: pData } = await supabase.from('group_buys').select('current_participants');
        
        const totalParts = pData?.reduce((acc, curr) => acc + (curr.current_participants || 0), 0) || 0;
        
        setStats({ total: tCount || 0, active: aCount || 0, participants: totalParts });
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
        <h1 className="text-3xl font-bold text-white mb-6">Compras em Grupo Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-purple-500/10 rounded-xl"><ShoppingBag className="w-8 h-8 text-purple-500" /></div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Total Compras</p>
                <h3 className="text-3xl font-bold text-white">{stats.total}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-green-500/10 rounded-xl"><Activity className="w-8 h-8 text-green-500" /></div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Compras Ativas</p>
                <h3 className="text-3xl font-bold text-white">{stats.active}</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-blue-500/10 rounded-xl"><Users className="w-8 h-8 text-blue-500" /></div>
              <div>
                <p className="text-sm font-medium text-zinc-400">Total Participantes</p>
                <h3 className="text-3xl font-bold text-white">{stats.participants}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
