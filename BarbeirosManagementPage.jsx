
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/admin/AdminLayout';
import BarbeiroDetailModal from '@/components/admin/BarbeiroDetailModal';
import { supabase } from '@/lib/customSupabaseClient';

export default function BarbeirosManagementPage() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBarbeiro, setSelectedBarbeiro] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchBarbeiros();
  }, []);

  const fetchBarbeiros = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setBarbeiros(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBarbeiros = barbeiros.filter(b => 
    (b.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     b.city?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedBarbeiros = filteredBarbeiros.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredBarbeiros.length / itemsPerPage);

  return (
    <AdminLayout>
      <Helmet>
        <title>Gestão de Barbeiros | Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Gestão de Barbeiros</h1>
            <p className="text-gray-400 text-sm">Gerencie todos os barbeiros registrados na plataforma.</p>
          </div>
          <Button onClick={() => setSelectedBarbeiro({})} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
            <Plus className="w-4 h-4 mr-2" /> Novo Barbeiro
          </Button>
        </div>

        <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Buscar por nome ou cidade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-black border-gray-800 text-white focus:border-[#FFD700]"
            />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-black/50 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Localização</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Carregando...</td>
                  </tr>
                ) : paginatedBarbeiros.length > 0 ? (
                  paginatedBarbeiros.map(b => (
                    <tr key={b.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                          {b.avatar_url ? <img src={b.avatar_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs">{b.full_name?.charAt(0) || '?'}</div>}
                        </div>
                        {b.full_name || 'Sem Nome'}
                      </td>
                      <td className="px-6 py-4">{b.city || '-'}</td>
                      <td className="px-6 py-4">{b.email || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-400/10 text-green-400">Ativo</span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedBarbeiro(b)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Nenhum barbeiro encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-800 flex justify-between items-center bg-black/50">
              <span className="text-sm text-gray-400">Página {page} de {totalPages}</span>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="border-gray-700 text-gray-300 hover:bg-gray-800">Anterior</Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="border-gray-700 text-gray-300 hover:bg-gray-800">Próxima</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedBarbeiro && (
        <BarbeiroDetailModal 
          barbeiro={selectedBarbeiro} 
          onClose={() => setSelectedBarbeiro(null)} 
          onSave={() => {
            setSelectedBarbeiro(null);
            fetchBarbeiros();
          }}
        />
      )}
    </AdminLayout>
  );
}
