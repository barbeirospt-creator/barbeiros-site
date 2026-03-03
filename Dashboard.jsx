
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, ShoppingBag, TrendingUp, Scissors } from "lucide-react";
import { supabase } from "@/lib/customSupabaseClient";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, topics: 0, buys: 0 });
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [usersRes, topicsRes, buysRes, barbersRes] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("forum_topics").select("*", { count: "exact", head: true }),
          supabase.from("group_buys").select("*", { count: "exact", head: true }),
          supabase.from("profiles").select("*").limit(4).order("created_at", { ascending: false })
        ]);

        setStats({
          users: usersRes.count || 0,
          topics: topicsRes.count || 0,
          buys: buysRes.count || 0
        });
        
        setBarbers(barbersRes.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const statCards = [
    { title: "Membros Registados", value: stats.users, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Tópicos no Fórum", value: stats.topics, icon: MessageSquare, color: "text-[#FFD700]", bg: "bg-[#FFD700]/10" },
    { title: "Compras em Grupo", value: stats.buys, icon: ShoppingBag, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-8 md:p-12">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-[#FFD700] opacity-5 rounded-full blur-3xl"></div>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Bem-vindo ao <span className="text-[#FFD700]">Barbeiros.pt</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl">
            A plataforma central para profissionais em Portugal. Faça conexões, partilhe conhecimento e aproveite oportunidades únicas.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 overflow-hidden group hover:border-[#FFD700]/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-zinc-400 text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {loading ? (
                      <div className="h-9 w-16 bg-zinc-800 animate-pulse rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    Ativos na comunidade
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Members */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Scissors className="text-[#FFD700]" /> Novos Barbeiros
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl h-48 animate-pulse"></div>
            ))}
          </div>
        ) : barbers.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-400">
            Nenhum barbeiro encontrado no momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {barbers.map((barber, idx) => (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + (idx * 0.05) }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-center hover:border-[#FFD700]/50 transition-colors group"
              >
                <div className="w-16 h-16 rounded-full bg-zinc-800 mx-auto mb-4 overflow-hidden border-2 border-transparent group-hover:border-[#FFD700] transition-colors">
                  {barber.avatar_url ? (
                    <img src={barber.avatar_url} alt={barber.display_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-xl">
                      {(barber.display_name || barber.full_name || '?').charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-white font-medium line-clamp-1">{barber.display_name || barber.full_name || 'Usuário'}</h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{barber.city || 'Portugal'}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
