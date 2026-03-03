
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import FilterAndSortBar from '@/components/admin/FilterAndSortBar';
import EditCompraModal from '@/components/admin/EditCompraModal';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';
import CompraCountdownTimer from '@/components/admin/CompraCountdownTimer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export default function AdminComprasEmGrupo() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [sortOption, setSortOption] = useState('prazo_asc');
  
  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchCompras();
  }, []);

  const fetchCompras = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('group_buy_opportunities')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setCompras(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao carregar compras em grupo.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentItem(null);
    setIsEditModalOpen(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  const handleDelete = (item) => {
    setCurrentItem(item);
    setIsConfirmOpen(true);
  };

  const handleSave = async (formData) => {
    setModalLoading(true);
    try {
      if (currentItem) {
        const { error } = await supabase
          .from('group_buy_opportunities')
          .update(formData)
          .eq('id', currentItem.id);
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Compra em grupo atualizada com sucesso.' });
      } else {
        // Create new
        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase
          .from('group_buy_opportunities')
          .insert([{ ...formData, user_id: userData.user?.id }]);
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Compra em grupo criada com sucesso.' });
      }
      setIsEditModalOpen(false);
      fetchCompras();
    } catch (error) {
      console.error('Error saving:', error);
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = async () => {
    setModalLoading(true);
    try {
      const { error } = await supabase
        .from('group_buy_opportunities')
        .delete()
        .eq('id', currentItem.id);
      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Compra eliminada com sucesso.' });
      setIsConfirmOpen(false);
      fetchCompras();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
    } finally {
      setModalLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Todos');
    setSortOption('prazo_asc');
  };

  // Filter and Sort logic
  const filteredAndSortedCompras = useMemo(() => {
    let result = [...compras];

    // Filter by search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(c => 
        (c.title?.toLowerCase().includes(lowerSearch))
      );
    }

    // Filter by status
    if (statusFilter !== 'Todos') {
      result = result.filter(c => c.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'prazo_asc':
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        case 'preco_asc':
          return (a.unit_price || 0) - (b.unit_price || 0);
        case 'preco_desc':
          return (b.unit_price || 0) - (a.unit_price || 0);
        case 'participantes_desc':
          return (b.current_participants || 0) - (a.current_participants || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [compras, searchTerm, statusFilter, sortOption]);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Ativa': return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">Ativa</span>;
      case 'Fechada': return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">Fechada</span>;
      case 'Expirada': return <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">Expirada</span>;
      case 'Rascunho': return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">Rascunho</span>;
      default: return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium">{status || 'Desconhecido'}</span>;
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Compras em Grupo | Admin</title>
      </Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Compras em Grupo</h1>
            <p className="text-gray-400">Faça a gestão das campanhas de compras conjuntas.</p>
          </div>
          <Button onClick={handleCreate} className="bg-[#FFD700] hover:bg-[#FFA500] text-black shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Nova Compra
          </Button>
        </div>

        <FilterAndSortBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortOption={sortOption}
          setSortOption={setSortOption}
          onReset={resetFilters}
        />

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-black/50 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Produto</th>
                  <th className="px-6 py-4 font-medium">Preço Un.</th>
                  <th className="px-6 py-4 font-medium">Participantes</th>
                  <th className="px-6 py-4 font-medium">Prazo</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">A carregar compras...</td>
                  </tr>
                ) : filteredAndSortedCompras.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">Nenhuma compra em grupo encontrada.</td>
                  </tr>
                ) : (
                  filteredAndSortedCompras.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex items-center gap-3">
                          {item.product_image_url ? (
                            <img src={item.product_image_url} alt={item.title} className="w-10 h-10 rounded object-cover border border-gray-700" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-500 text-xs">Sem Img</div>
                          )}
                          <span>{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">€{parseFloat(item.unit_price || 0).toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {item.current_participants || 0} {item.max_participants ? `/ ${item.max_participants}` : ''}
                      </td>
                      <td className="px-6 py-4">
                        <CompraCountdownTimer deadline={item.deadline} />
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-[#FFD700] hover:text-[#FFA500] hover:bg-[#FFD700]/10 px-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 px-2">
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

        <EditCompraModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSave}
          item={currentItem}
          isLoading={modalLoading}
        />

        <ConfirmationDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Eliminar Compra"
          message={`Tem a certeza que deseja eliminar "${currentItem?.title}"? Esta ação não pode ser desfeita.`}
          isLoading={modalLoading}
        />
      </div>
    </AdminLayout>
  );
}
