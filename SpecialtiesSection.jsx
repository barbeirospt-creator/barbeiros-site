import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Scissors, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export default function SpecialtiesSection({ specialties, businessId, onRefresh }) {
  const { toast } = useToast();

  const handleAddStub = () => {
    toast({ title: "🚧 Adicionar Especialidade", description: "Formulário de especialidade será adicionado em breve." });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Eliminar especialidade?')) return;
    try {
      const { error } = await supabase.from('specialties').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Especialidade eliminada.' });
      onRefresh();
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao eliminar.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Especialidades</h2>
        <Button onClick={handleAddStub} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
          <Plus size={16} className="mr-2" /> Adicionar Especialidade
        </Button>
      </div>

      {specialties.length === 0 ? (
        <Card className="bg-black border-gray-800 p-12 text-center text-gray-400">
          Nenhuma especialidade definida.
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {specialties.map(spec => (
            <Card key={spec.id} className="bg-gray-900 border-gray-800 p-4 relative group">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-900/30" onClick={() => handleDelete(spec.id)}>
                   <Trash2 size={14} />
                 </Button>
              </div>
              <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center mb-3">
                <Scissors className="text-[#FFD700]" size={24} />
              </div>
              <h3 className="font-bold text-white">{spec.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{spec.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}