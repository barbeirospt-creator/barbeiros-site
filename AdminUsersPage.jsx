
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import EditUserModal from '@/components/admin/EditUserModal';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters and Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao carregar utilizadores.' });
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
        // Edit
        const { error } = await supabase
          .from('admin_users')
          .update({
            name: formData.name,
            role: formData.role,
            permissions: formData.permissions,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentItem.id);
          
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Utilizador atualizado com sucesso.' });
      } else {
        // Create
        // Check if email exists
        const { data: existing } = await supabase
          .from('admin_users')
          .select('id')
          .eq('email', formData.email)
          .single();
          
        if (existing) {
          throw new Error("Este email já está registado.");
        }

        const { error } = await supabase
          .from('admin_users')
          .insert([{ 
            ...formData, 
            created_at: new Date().toISOString() 
          }]);
          
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Utilizador criado com sucesso.' });
      }
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = async () => {
    setModalLoading(true);
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', currentItem.id);
        
      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Utilizador eliminado com sucesso.' });
      setIsConfirmOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Erro', description: error.message });
    } finally {
      setModalLoading(false);
    }
  };

  // Filter logic
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(u => 
        (u.name?.toLowerCase().includes(lowerSearch) || u.email?.toLowerCase().includes(lowerSearch))
      );
    }

    if (roleFilter !== 'All') {
      result = result.filter(u => u.role === roleFilter);
    }

    return result;
  }, [users, searchTerm, roleFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Super Admin': return <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium border border-purple-500/30">Super Admin</span>;
      case 'Admin': return <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium border border-blue-500/30">Admin</span>;
      case 'Editor': return <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30">Editor</span>;
      default: return <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs font-medium border border-gray-500/30">{role}</span>;
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <title>Utilizadores Admin | Barbeiros PT</title>
      </Helmet>

      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Utilizadores Admin</h1>
            <p className="text-gray-400">Faça a gestão de administradores e editores da plataforma.</p>
          </div>
          <Button onClick={handleCreate} className="bg-[#FFD700] hover:bg-[#FFA500] text-black shrink-0">
            <Plus className="w-4 h-4 mr-2" /> Novo Utilizador
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Pesquisar por nome ou email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black border-gray-700 text-white focus:ring-[#FFD700] focus:border-[#FFD700]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-4 h-4 hidden sm:block" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px] bg-black border-gray-700 text-white focus:ring-[#FFD700] focus:border-[#FFD700]">
                <SelectValue placeholder="Filtrar por Função" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-white">
                <SelectItem value="All">Todas as Funções</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-black/50 border-b border-gray-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Nome</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium">Data Criação</th>
                  <th className="px-6 py-4 font-medium text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFD700]"></div>
                        <span>A carregar utilizadores...</span>
                      </div>
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">Nenhum utilizador encontrado.</td>
                  </tr>
                ) : (
                  paginatedUsers.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[#FFD700] text-xs font-bold shrink-0">
                            {getInitials(item.name)}
                          </div>
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.email}</td>
                      <td className="px-6 py-4">{getRoleBadge(item.role)}</td>
                      <td className="px-6 py-4">
                        {item.is_active ? (
                          <span className="flex items-center text-green-400 text-xs font-medium gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            Ativo
                          </span>
                        ) : (
                          <span className="flex items-center text-red-400 text-xs font-medium gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                            Inativo
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(item.created_at).toLocaleDateString('pt-PT')}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} className="text-[#FFD700] hover:text-[#FFA500] hover:bg-[#FFD700]/10 px-2 h-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(item)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 px-2 h-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {!loading && filteredUsers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-800 bg-black/30 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                A mostrar {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, filteredUsers.length)} de {filteredUsers.length}
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="border-gray-700 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors ${
                        page === currentPage 
                          ? 'bg-[#FFD700] text-black font-medium' 
                          : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="border-gray-700 bg-black text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </div>

        <EditUserModal
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
          title="Eliminar Utilizador"
          message={`Tem a certeza que deseja eliminar "${currentItem?.name}"? Esta ação não pode ser desfeita.`}
          isLoading={modalLoading}
        />
      </div>
    </AdminLayout>
  );
}
