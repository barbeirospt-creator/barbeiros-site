
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/customSupabaseClient";
import { motion } from "framer-motion";
import { ShoppingBag, Users, Clock, Plus, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function GroupPurchasesPage() {
  const [buys, setBuys] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchBuys() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("group_buys")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        setBuys(data || []);
      } catch (error) {
        console.error("Error fetching group buys:", error);
        toast({
          title: "Erro",
          description: "Falha ao carregar as compras em grupo.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    fetchBuys();
  }, [toast]);

  const handleAction = () => {
    toast({
      title: "Ação não disponível",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShoppingBag className="text-[#FFD700]" /> Compras em Grupo
          </h1>
          <p className="text-zinc-400 mt-1">Economize juntando-se a outros profissionais para comprar em volume.</p>
        </div>
        <button 
          onClick={handleAction}
          className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#FFA500] transition-colors"
        >
          <Plus size={18} /> Nova Compra
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl h-64 animate-pulse"></div>
          ))
        ) : buys.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl">
            <ShoppingBag className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhuma compra ativa</h3>
            <p className="text-zinc-400 mb-6">Crie uma nova oportunidade de compra em grupo para a comunidade.</p>
            <button 
              onClick={handleAction}
              className="bg-[#FFD700] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#FFA500] transition-colors inline-block"
            >
              Criar Oportunidade
            </button>
          </div>
        ) : (
          buys.map((buy, idx) => {
            const progress = buy.max_participants ? (buy.current_participants / buy.max_participants) * 100 : 0;
            
            return (
              <motion.div
                key={buy.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-[#FFD700]/50 transition-all flex flex-col group"
              >
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-[#FFD700] transition-colors">
                      {buy.product_name}
                    </h3>
                    <span className="text-[#FFD700] font-bold text-lg whitespace-nowrap bg-[#FFD700]/10 px-2 py-1 rounded">
                      €{buy.unit_price}
                    </span>
                  </div>
                  
                  <p className="text-sm text-zinc-400 mb-6 line-clamp-3 h-14">
                    {buy.objective || "Sem descrição disponível."}
                  </p>
                  
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between text-zinc-300">
                      <span className="flex items-center gap-2"><Users className="w-4 h-4 text-zinc-500" /> Participantes</span>
                      <span className="font-semibold">{buy.current_participants} / {buy.max_participants || '∞'}</span>
                    </div>
                    
                    {buy.max_participants && (
                      <div className="w-full bg-zinc-950 rounded-full h-2 border border-zinc-800 overflow-hidden">
                        <div 
                          className="bg-[#FFD700] h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(100, progress)}%` }}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between text-zinc-300">
                      <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-zinc-500" /> Fim em</span>
                      <span>{buy.deadline ? new Date(buy.deadline).toLocaleDateString() : 'Sem prazo'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-zinc-950 border-t border-zinc-800">
                  <button 
                    onClick={handleAction}
                    className="w-full py-2.5 bg-white text-black font-bold rounded-lg hover:bg-[#FFD700] transition-colors flex items-center justify-center gap-2"
                  >
                    Participar <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
