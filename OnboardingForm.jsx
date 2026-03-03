import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/customSupabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";

export default function OnboardingForm({ onComplete }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    most_bought_products: [],
    sells_retail: false,
    top_sold_text: "",
    no_retail_reason: "nao_quer",
    difficulties: [],
    wants_support: "talvez",
    group_buy_interest: "talvez"
  });

  useEffect(() => {
    if (!user) return;
    const fetchOnboarding = async () => {
      try {
        const { data } = await supabase.from('profiles').select('onboarding_data').eq('id', user.id).single();
        if (data?.onboarding_data) setFormData(data.onboarding_data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchOnboarding();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          onboarding_data: formData,
          onboarding_completed: true
        })
        .eq('id', user.id);

      if (error) throw error;
      
      toast({ title: "Sucesso", description: "Preferências salvas com sucesso!" });
      if (onComplete) onComplete();
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao salvar preferências.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-black p-6 rounded-lg border border-gray-800">
      <h2 className="text-2xl font-bold text-[#FFD700]">Configuração do Perfil</h2>
      
      <div>
        <label className="text-white block mb-2">Vende produtos aos clientes?</label>
        <select 
          className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded"
          value={formData.sells_retail.toString()}
          onChange={e => setFormData({...formData, sells_retail: e.target.value === 'true'})}
        >
          <option value="true">Sim</option>
          <option value="false">Não</option>
        </select>
      </div>

      {formData.sells_retail ? (
        <div>
          <label className="text-white block mb-2">Qual o produto mais vendido?</label>
          <input 
            type="text"
            className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded"
            value={formData.top_sold_text || ""}
            onChange={e => setFormData({...formData, top_sold_text: e.target.value})}
          />
        </div>
      ) : (
        <div>
          <label className="text-white block mb-2">Motivo por não vender produtos?</label>
          <select 
            className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded"
            value={formData.no_retail_reason}
            onChange={e => setFormData({...formData, no_retail_reason: e.target.value})}
          >
            <option value="falta_dinheiro">Falta de Investimento</option>
            <option value="nao_sabe_vender">Não sei vender</option>
            <option value="nao_tem_espaco">Sem espaço</option>
            <option value="nao_quer">Não tenho interesse</option>
          </select>
        </div>
      )}

      <div>
        <label className="text-white block mb-2">Interesse em Compras em Grupo (Stock)?</label>
        <select 
          className="w-full bg-gray-900 border border-gray-700 text-white p-2 rounded"
          value={formData.group_buy_interest}
          onChange={e => setFormData({...formData, group_buy_interest: e.target.value})}
        >
          <option value="sim">Sim</option>
          <option value="talvez">Talvez</option>
          <option value="nao">Não</option>
        </select>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-[#FFD700] text-black hover:bg-[#FFA500]">
        {loading ? "A Guardar..." : "Guardar Respostas"}
      </Button>
    </form>
  );
}