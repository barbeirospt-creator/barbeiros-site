import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

export default function PortfolioSection({ items, businessId, onRefresh }) {
  const { toast } = useToast();

  const handleAddStub = () => {
    toast({ title: "🚧 Em construção", description: "A funcionalidade de adicionar item ao portefólio será implementada em breve. Funciona de forma semelhante à galeria de fotos." });
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Eliminar este item do portefólio?')) return;
    try {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', itemId);
      if (error) throw error;
      toast({ title: 'Sucesso', description: 'Item eliminado.' });
      onRefresh();
    } catch (err) {
      toast({ title: 'Erro', description: 'Falha ao eliminar item.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Portefólio de Trabalhos</h2>
        <Button onClick={handleAddStub} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
          <Plus size={16} className="mr-2" /> Adicionar Trabalho
        </Button>
      </div>

      {items.length === 0 ? (
        <Card className="bg-black border-gray-800 p-12 text-center text-gray-400">
          O seu portefólio está vazio. Mostre os seus melhores cortes!
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <Card key={item.id} className="bg-gray-900 border-gray-800 overflow-hidden group">
              <div className="aspect-video bg-black relative">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDelete(item.id)}>
                     <Trash2 size={14} />
                   </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                {item.completion_date && (
                  <p className="text-xs text-gray-500 mt-2">{new Date(item.completion_date).toLocaleDateString()}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}