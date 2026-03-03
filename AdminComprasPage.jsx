
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminTable from '@/components/admin/AdminTable';
import AdminModal from '@/components/admin/AdminModal';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export default function AdminComprasPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('marketplace_listings').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setListings(data || []);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error fetching listings', description: err.message });
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
      const { error } = await supabase.from('marketplace_listings').update({
        name: formData.name,
        price: formData.price,
        category: formData.category,
        description: formData.description
      }).eq('id', currentItem.id);
      
      if (error) throw error;
      
      toast({ title: 'Success', description: 'Listing updated successfully.' });
      setIsModalOpen(false);
      fetchListings();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error updating listing', description: err.message });
    } finally {
      setModalLoading(false);
    }
  };

  const confirmDelete = async () => {
    setModalLoading(true);
    try {
      const { error } = await supabase.from('marketplace_listings').delete().eq('id', currentItem.id);
      if (error) throw error;
      
      toast({ title: 'Success', description: 'Listing deleted successfully.' });
      setIsConfirmOpen(false);
      fetchListings();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error deleting listing', description: err.message });
    } finally {
      setModalLoading(false);
    }
  };

  const columns = [
    { header: 'Product Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Price', accessor: 'price', render: (row) => `€${row.price}` },
    { header: 'Created', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  const modalFields = [
    { name: 'name', label: 'Name', type: 'text', value: currentItem?.name, required: true },
    { name: 'category', label: 'Category', type: 'text', value: currentItem?.category, required: true },
    { name: 'price', label: 'Price', type: 'number', value: currentItem?.price, required: true },
    { name: 'description', label: 'Description', type: 'textarea', value: currentItem?.description }
  ];

  return (
    <AdminLayout>
      <Helmet>
        <title>Compras Management | Admin</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Compras Management</h1>
          <p className="text-gray-400">Manage marketplace listings.</p>
        </div>
        
        <AdminTable 
          columns={columns} 
          data={listings} 
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          title="Edit Listing"
          fields={modalFields}
          isLoading={modalLoading}
        />

        <ConfirmationDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Listing"
          message={`Are you sure you want to delete "${currentItem?.name}"?`}
          isLoading={modalLoading}
        />
      </div>
    </AdminLayout>
  );
}
