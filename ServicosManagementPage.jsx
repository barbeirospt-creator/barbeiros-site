
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Plus, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/admin/AdminLayout';
import ServiceFormModal from '@/components/admin/ServiceFormModal';
import { supabase } from '@/lib/customSupabaseClient';

export default function ServicosManagementPage() {
  const [servicos, setServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tabela_servicos')
        .select('*')
        .order('criado_em', { ascending: false });
      
      if (error) throw error;
      setServicos(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServicos = servicos.filter(s => 
    s.nome_servico?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedServicos = filteredServicos.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredServicos.length / itemsPerPage);

  return (
    <AdminLayout>
      <Helmet>
        <title>Gestão de Serviços | Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Catálogo de Serviços</h1>
            <p className="text-gray-400 text-sm">Gerencie os serviços padrão disponíveis na plataforma.</p>
          </div>
          <Button onClick={() => setSelectedService({})} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
            <Plus className="w-4 h-4 mr-2" /> Novo Serviço
          </Button>
        </div>

        <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Buscar serviço..." 
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
                  <th className="px-6 py-4">Nome do Serviço</th>
                  <th className="px-6 py-4">Preço Base</th>
                  <th className="px-6 py-4">Duração</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Carregando...</td>
                  </tr>
                ) : paginatedServicos.length > 0 ? (
                  paginatedServicos.map(s => (
                    <tr key={s.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{s.nome_servico}</td>
                      <td className="px-6 py-4">€{s.preco}</td>
                      <td className="px-6 py-4">{s.duracao} min</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedService(s)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">Nenhum serviço encontrado.</td>
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

      {selectedService && (
        <ServiceFormModal 
          service={selectedService.id ? selectedService : null} 
          onClose={() => setSelectedService(null)} 
          onSave={() => {
            setSelectedService(null);
            fetchServicos();
          }}
        />
      )}
    </AdminLayout>
  );
}
