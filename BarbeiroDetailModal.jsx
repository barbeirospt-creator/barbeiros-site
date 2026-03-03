
import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export default function BarbeiroDetailModal({ barbeiro, onClose, onSave }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: '',
    full_name: '',
    bio: '',
    city: '',
    phone: '',
    email: '',
    avatar_url: '',
    rating: 0
  });
  const [integrationStatus, setIntegrationStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (barbeiro) {
      setFormData({
        id: barbeiro.id,
        full_name: barbeiro.full_name || '',
        bio: barbeiro.bio || '',
        city: barbeiro.city || '',
        phone: barbeiro.phone || '',
        email: barbeiro.email || '',
        avatar_url: barbeiro.avatar_url || '',
        rating: barbeiro.rating || 0
      });
      fetchIntegrationStatus(barbeiro.id);
    }
  }, [barbeiro]);

  const fetchIntegrationStatus = async (id) => {
    try {
      const { data, error } = await supabase
        .from('barber_integrations')
        .select('*')
        .eq('barber_id', id)
        .single();
      
      if (!error && data) {
        setIntegrationStatus(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          city: formData.city,
          phone: formData.phone,
        })
        .eq('id', formData.id);

      if (error) throw error;
      
      toast({ title: 'Sucesso', description: 'Perfil atualizado.' });
      onSave();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem a certeza que deseja eliminar este barbeiro?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', formData.id);
      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Barbeiro eliminado.' });
      onSave();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!barbeiro) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-white">Detalhes do Barbeiro</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <form id="barber-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                <Input name="full_name" value={formData.full_name} onChange={handleChange} className="bg-black text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <Input name="email" value={formData.email} disabled className="bg-gray-800 text-gray-400" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Cidade</label>
                <Input name="city" value={formData.city} onChange={handleChange} className="bg-black text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Telefone</label>
                <Input name="phone" value={formData.phone} onChange={handleChange} className="bg-black text-white" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Bio</label>
              <Textarea name="bio" value={formData.bio} onChange={handleChange} className="bg-black text-white min-h-[100px]" />
            </div>

            <div className="bg-black/50 p-4 rounded-lg border border-gray-800">
              <h3 className="font-medium text-white mb-2">Google Meu Negócio Status</h3>
              {integrationStatus?.google_business_connected ? (
                <div className="flex items-center text-green-400 gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Sincronizado ({integrationStatus.google_business_name})
                </div>
              ) : (
                <div className="flex items-center text-gray-500 gap-2 text-sm">
                  <XCircle className="w-4 h-4" />
                  Não sincronizado
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4 flex justify-between items-center">
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
          </Button>
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="bg-transparent text-white">
              Cancelar
            </Button>
            <Button type="submit" form="barber-form" disabled={loading} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
              <Save className="w-4 h-4 mr-2" /> Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
