
import React, { useEffect, useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useGroupBuyManagement } from "@/hooks/useGroupBuyManagement";
import GroupBuyTable from "@/components/group-buy/GroupBuyTable";
import GroupBuyForm from "@/components/group-buy/GroupBuyForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function GroupBuyPage() {
  const { getGroupBuys, loading, error } = useGroupBuyManagement();
  const [groupBuys, setGroupBuys] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("active");
  const [sortBy, setSortBy] = useState("deadline");

  const loadData = async () => {
    const data = await getGroupBuys({ status: filterStatus, sortBy });
    setGroupBuys(data || []);
  };

  useEffect(() => {
    loadData();
  }, [filterStatus, sortBy]);

  return (
    <AppLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Compras <span className="text-[#FFD700]">Em Grupo</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Junte-se a outros barbeiros para obter melhores preços em produtos.
            </p>
          </div>
          <Button 
            onClick={() => setIsFormOpen(true)} 
            className="bg-[#FFD700] text-black hover:bg-[#FFA500] w-full sm:w-auto"
          >
            <Plus size={18} className="mr-2" /> Nova Compra
          </Button>
        </div>

        <div className="flex flex-col gap-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Estado</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-black/50 border-gray-700 text-white focus:ring-[#FFD700]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="active" className="focus:bg-gray-800 focus:text-white">Ativas</SelectItem>
                  <SelectItem value="completed" className="focus:bg-gray-800 focus:text-white">Concluídas</SelectItem>
                  <SelectItem value="expired" className="focus:bg-gray-800 focus:text-white">Expiradas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-black/50 border-gray-700 text-white focus:ring-[#FFD700]">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-700 text-white">
                  <SelectItem value="deadline" className="focus:bg-gray-800 focus:text-white">Prazo mais próximo</SelectItem>
                  <SelectItem value="participants" className="focus:bg-gray-800 focus:text-white">Mais participantes</SelectItem>
                  <SelectItem value="created_at" className="focus:bg-gray-800 focus:text-white">Mais recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
             <Button 
               variant="outline" 
               size="icon" 
               onClick={loadData} 
               disabled={loading} 
               className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
             >
               <RefreshCw size={18} className={loading ? "animate-spin text-[#FFD700]" : ""} />
             </Button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-8 rounded-xl text-center backdrop-blur-sm">
            <p className="mb-4 text-lg">Ocorreu um erro ao carregar as compras em grupo.</p>
            <Button onClick={loadData} variant="outline" className="border-red-800 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors">
              <RefreshCw size={16} className="mr-2" /> Tentar Novamente
            </Button>
          </div>
        ) : (
          <div className="bg-black/40 rounded-xl border border-gray-800/50 overflow-hidden backdrop-blur-sm shadow-xl">
            <GroupBuyTable groupBuys={groupBuys} loading={loading} onRefresh={loadData} />
          </div>
        )}

        <GroupBuyForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={loadData} />
      </div>
    </AppLayout>
  );
}
