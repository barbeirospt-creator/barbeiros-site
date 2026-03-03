
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDirectSupabase } from '@/hooks/useDirectSupabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export default function AdminForumPage() {
  // Task 6: Hook updated to fetch without expansion and merge profiles manually
  const { fetchTopics, deleteTopic, loading } = useDirectSupabase();
  const [topics, setTopics] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const data = await fetchTopics({ search, status: statusFilter });
      setTopics(data || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao carregar tópicos." });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => { loadData(); }, 500);
    return () => clearTimeout(timer);
  }, [statusFilter, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Apagar este tópico permanentemente?")) return;
    try {
      await deleteTopic(id);
      toast({ title: "Sucesso", description: "Tópico apagado." });
      loadData();
    } catch (err) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao apagar." });
    }
  };

  const pendingCount = topics.filter(t => t.status === 'pending').length;

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Gestão do Fórum</h1>
          <div className="flex gap-4">
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-zinc-400">Total Tópicos</p>
              <p className="text-lg font-bold text-white">{topics.length}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-center">
              <p className="text-xs text-zinc-400">Pendentes</p>
              <p className="text-lg font-bold text-yellow-500">{pendingCount}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input 
              placeholder="Pesquisar..." 
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-zinc-950 border-zinc-800 text-white w-full" 
            />
          </div>
          <select 
            className="bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 w-full sm:w-48"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="approved">Aprovados</option>
            <option value="pending">Pendentes</option>
            <option value="blocked">Bloqueados</option>
            <option value="flagged">Reportados</option>
          </select>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
              <thead className="bg-zinc-800/50 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Tópico</th>
                  <th className="px-6 py-4 font-medium">Autor</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#FFD700]" /></td></tr>
                ) : topics.length === 0 ? (
                  <tr><td colSpan="6" className="text-center py-8 text-zinc-500">Nenhum tópico encontrado.</td></tr>
                ) : (
                  topics.map(topic => (
                    <tr key={topic.id} className="hover:bg-zinc-800/30">
                      <td className="px-6 py-4">
                        <p className="font-medium text-white truncate max-w-[200px]">{topic.title}</p>
                      </td>
                      <td className="px-6 py-4">{topic.profiles?.full_name || 'Anónimo'}</td>
                      <td className="px-6 py-4 text-zinc-500">{topic.profiles?.email || 'N/A'}</td>
                      <td className="px-6 py-4">{new Date(topic.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          topic.status === 'approved' ? 'border-green-500 text-green-400' : 
                          topic.status === 'blocked' ? 'border-red-500 text-red-400' : 
                          topic.status === 'flagged' ? 'border-orange-500 text-orange-400' : 'border-yellow-500 text-yellow-400'
                        }>
                          {topic.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300" onClick={() => navigate(`/admin/forum/${topic.id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400 hover:text-red-300" onClick={() => handleDelete(topic.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
