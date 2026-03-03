
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error fetching users', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    setCurrentItem(item);
    setIsConfirmOpen(true);
  };

  const handleSave = async (formData) => {
    setModalLoading(true);
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: formData.full_name,
        bio: formData.bio,
        role: formData.role
      }).eq('id', currentItem.id);
      
      if (error) throw error;
      
      toast({ title: 'Success', description: 'User profile updated successfully.' });
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error updating user profile', description: err.message });
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = async () => {
    setModalLoading(true);
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', currentItem.id);
      if (error) throw error;
      
      toast({ title: 'Success', description: 'User profile deleted successfully.' });
      setIsConfirmOpen(false);
      fetchUsers();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error deleting user profile', description: err.message });
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'full_name' },
    { header: 'Role', accessor: 'role' },
    { header: 'Created', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  const modalFields = [
    { name: 'full_name', label: 'Full Name', type: 'text', value: currentItem?.full_name, required: true },
    { name: 'role', label: 'Role', type: 'text', value: currentItem?.role, required: true },
    { name: 'bio', label: 'Bio', type: 'textarea', value: currentItem?.bio }
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Perfis de Usuários | Admin</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Perfis de Usuários</h1>
          <p className="text-gray-400">Manage user profiles.</p>
        </div>
        
        <AdminTable 
          columns={columns} 
          data={users} 
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          title="Edit User Profile"
          fields={modalFields}
          isLoading={modalLoading}
        />

        <ConfirmationDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete User"
          message={`Are you sure you want to delete profile for "${currentItem?.full_name}"?`}
          isLoading={modalLoading}
        />
      </div>
    </AdminLayout>
  );
}
