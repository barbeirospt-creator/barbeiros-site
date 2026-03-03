
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useDirectSupabase } from '@/hooks/useDirectSupabase';
import { ArrowLeft, Loader2, Trash2, Users, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminGroupPurchaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchGroupPurchaseDetail, deleteGroupPurchase, loading } = useDirectSupabase();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await fetchGroupPurchaseDetail(id);
      setData(result);
    };
    loadData();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Apagar esta compra permanentemente?")) return;
    await deleteGroupPurchase(id);
    navigate('/admin/group-purchases/list');
  };

  if (loading && !data) return <AdminLayout><div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#FFD700]" /></div></AdminLayout>;
  if (!data) return null;

  const { purchase, participants } = data;
  const totalCost = (purchase.unit_price * purchase.current_participants).toFixed(2);

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        <button onClick={() => navigate('/admin/group-purchases/list')} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-2 text-sm">
          <ArrowLeft size={16} /> Voltar à Lista
        </button>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{purchase.product_name}</h1>
                <Badge variant="outline">{purchase.status}</Badge>
              </div>
              <Button variant="destructive" size="sm" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-2" /> Apagar</Button>
            </div>
            <p className="text-zinc-300 mb-6">{purchase.objective}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-zinc-950 border-zinc-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <Receipt className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Preço Unitário</p>
                    <p className="text-lg font-bold text-white">€{purchase.unit_price}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-950 border-zinc-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Participantes</p>
                    <p className="text-lg font-bold text-white">{purchase.current_participants} / {purchase.max_participants || '∞'}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-zinc-950 border-zinc-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <Receipt className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Custo Total Atual</p>
                    <p className="text-lg font-bold text-white">€{totalCost}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Lista de Participantes ({participants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="bg-zinc-800/50 text-gray-400 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium text-center">Qtd. Pedida</th>
                    <th className="px-4 py-3 font-medium text-right">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {participants.length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-6 text-zinc-500">Sem participantes.</td></tr>
                  ) : (
                    participants.map(p => (
                      <tr key={p.id}>
                        <td className="px-4 py-3 font-medium text-white">{p.profiles?.full_name || 'Usuário'}</td>
                        <td className="px-4 py-3">{p.profiles?.email || 'N/A'}</td>
                        <td className="px-4 py-3 text-center">{p.quantity_ordered}</td>
                        <td className="px-4 py-3 text-right">{new Date(p.joined_at || p.created_at || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
