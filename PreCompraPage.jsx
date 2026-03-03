
import React from 'react';
import { ShoppingBag, Search, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';

export default function PreCompraPage() {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "Ação não disponível",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Helmet>
        <title>Pré-Compra | Barbeiros PT</title>
        <meta name="description" content="Faça a gestão de pré-compras e encomendas." />
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingBag className="text-[#FFD700] h-6 w-6" />
            Pré-Compra
          </h1>
          <p className="text-gray-400 text-sm mt-1">Gira as suas pré-compras e campanhas de grupo</p>
        </div>
        <Button onClick={handleAction} className="bg-[#FFD700] text-black hover:bg-[#FFA500] flex items-center gap-2">
          <Plus size={18} /> Nova Pré-Compra
        </Button>
      </div>

      <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800 mt-8">
        <ShoppingBag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Nenhuma campanha ativa</h3>
        <p className="text-gray-400">Não existem campanhas de pré-compra ativas no momento.</p>
        <Button onClick={handleAction} variant="outline" className="mt-6 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700]/10">
          Criar a primeira campanha
        </Button>
      </div>
    </div>
  );
}
