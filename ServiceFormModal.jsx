
import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export default function ServiceFormModal({ service, onClose, onSave }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome_servico: '',
    descricao: '',
    preco: '',
    duracao: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        nome_servico: service.nome_servico || '',
        descricao: service.descricao || '',
        preco: service.preco || '',
        duracao: service.duracao || ''
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (service?.id) {
        const { error } = await supabase
          .from('tabela_servicos')
          .update({
            nome_servico: formData.nome_servico,
            descricao: formData.descricao,
            preco: formData.preco,
            duracao: formData.duracao
          })
          .eq('id', service.id);
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Serviço atualizado.' });
      } else {
        const { error } = await supabase
          .from('tabela_servicos')
          .insert([{
            nome_servico: formData.nome_servico,
            descricao: formData.descricao,
            preco: formData.preco,
            duracao: formData.duracao
          }]);
        if (error) throw error;
        toast({ title: 'Sucesso', description: 'Serviço criado.' });
      }
      onSave();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erro', description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">{service ? 'Editar' : 'Novo'} Serviço</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nome do Serviço</label>
            <Input name="nome_servico" value={formData.nome_servico} onChange={handleChange} required className="bg-black text-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Preço (€)</label>
              <Input name="preco" type="number" step="0.01" value={formData.preco} onChange={handleChange} required className="bg-black text-white" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Duração (min)</label>
              <Input name="duracao" type="number" value={formData.duracao} onChange={handleChange} required className="bg-black text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Descrição</label>
            <Textarea name="descricao" value={formData.descricao} onChange={handleChange} className="bg-black text-white" />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="bg-transparent text-white border-gray-700 hover:bg-gray-800">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
              <Save className="w-4 h-4 mr-2" /> Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
