import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { barbershopService } from '@/services/barbershopService';
import { useAuth } from '@/contexts/AuthContext';

export const CreateBarbershopForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    phone: '',
    email: user?.email || '',
    hours: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await barbershopService.createBarbershop({
        ...formData,
        user_id: user?.id,
        contacts: {
          phone: formData.phone,
          email: formData.email
        },
        hours: [
          { day: 'Segunda', open: '09:00', close: '19:00' },
          { day: 'Terça', open: '09:00', close: '19:00' },
          { day: 'Quarta', open: '09:00', close: '19:00' },
          { day: 'Quinta', open: '09:00', close: '19:00' },
          { day: 'Sexta', open: '09:00', close: '19:00' },
          { day: 'Sábado', open: '09:00', close: '13:00' },
          { day: 'Domingo', open: 'Fechado', close: 'Fechado' }
        ]
      });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Barbearia criada com sucesso!",
      });
      navigate('/dashboard/barbershop');
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Falha ao criar barbearia. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200 my-8">
      <h2 className="text-2xl font-bold mb-6">Criar Barbearia</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome da Barbearia</label>
          <Input 
            required
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="Ex: Barbearia do João"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Localização (Cidade, Distrito)</label>
          <Input 
            required
            value={formData.location}
            onChange={e => setFormData({...formData, location: e.target.value})}
            placeholder="Ex: Lisboa, Lisboa"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea 
            className="w-full min-h-[100px] rounded-md border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Conte um pouco sobre sua história..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Telefone</label>
            <Input 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="+351 912 345 678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input 
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'A criar...' : 'Criar Barbearia'}
        </Button>
      </form>
    </div>
  );
};