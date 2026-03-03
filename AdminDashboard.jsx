
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Users, MessageSquare } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/lib/customSupabaseClient';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    barbeiros: 0,
    forumTopics: 0,
    usuarios: 0,
    adminUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [
        { count: barbeirosCount },
        { count: forumCount },
        { count: usuariosCount },
        { count: adminUsersCount },
      ] = await Promise.all([
        supabase.from('tabela_usuarios').select('*', { count: 'exact', head: true }).eq('tipo_usuario', 'barbeiro'),
        supabase.from('forum_topics').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('admin_users').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        barbeiros: barbeirosCount || 0,
        forumTopics: forumCount || 0,
        usuarios: usuariosCount || 0,
        adminUsers: adminUsersCount || 0
      });

    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Barbeiros', value: stats.barbeiros, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Total Fórum Tópicos', value: stats.forumTopics, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { title: 'Total Usuários', value: stats.usuarios, icon: Users, color: 'text-[#FFD700]', bg: 'bg-[#FFD700]/10' },
    { title: 'Equipa Admin', value: stats.adminUsers, icon: Users, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Dashboard | Admin</title>
      </Helmet>

      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Bem-vindo ao painel de administração geral.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-900 rounded-xl border border-gray-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center gap-4 shadow-sm">
                  <div className={`p-4 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex items-center justify-center">
            <p className="text-gray-500">Atividade recente será exibida aqui.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
