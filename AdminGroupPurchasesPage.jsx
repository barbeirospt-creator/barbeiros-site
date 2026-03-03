
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDirectSupabase } from '@/hooks/useDirectSupabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminGroupPurchasesPage() {
  const { fetchGroupPurchases, deleteGroupPurchase, loading } = useDirectSupabase();
  const [purchases, setPurchases] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const loadData = async () => {
    const data = await fetchGroupPurchases({ search, status: statusFilter });
    setPurchases(data || []);
  };

  useEffect(() => {
    const timer = setTimeout(() => { loadData(); }, 300);
    return () => clearTimeout(timer);
  }, [statusFilter, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Apagar esta compra em grupo permanentemente?")) return;
    await deleteGroupPurchase(id);
    loadData();
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Lista de Compras em Grupo</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input placeholder="Pesquisar..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-zinc-950 border-zinc-800 text-white" />
          </div>
          <select 
            className="bg-zinc-950 border border-zinc-800 text-white rounded-md px-3 py-2 sm:w-48 outline-none"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Todos Status</option>
            <option value="active">Ativas</option>
            <option value="completed">Concluídas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
              <thead className="bg-zinc-800/50 text-gray-400 border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Nome do Produto</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Participantes</th>
                  <th className="px-6 py-4 font-medium">Data Criação</th>
                  <th className="px-6 py-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#FFD700]" /></td></tr>
                ) : purchases.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-zinc-500">Nenhuma compra encontrada.</td></tr>
                ) : (
                  purchases.map(p => (
                    <tr key={p.id} className="hover:bg-zinc-800/30">
                      <td className="px-6 py-4 font-medium text-white">{p.product_name}</td>
                      <td className="px-6 py-4"><Badge variant="outline">{p.status}</Badge></td>
                      <td className="px-6 py-4">{p.current_participants} / {p.max_participants || '∞'}</td>
                      <td className="px-6 py-4">{new Date(p.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/group-purchases/${p.id}`)}><Eye className="w-4 h-4 text-blue-400" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)}><Trash2 className="w-4 h-4 text-red-400" /></Button>
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
