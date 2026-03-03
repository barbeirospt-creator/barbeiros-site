
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';

export default function CompraParticipantsList({ purchaseId }) {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (purchaseId) {
      fetchParticipants();
    }
  }, [purchaseId]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('group_buy_interests')
        .select(`
          id,
          quantity_interested,
          created_at,
          profiles:user_id ( full_name, email )
        `)
        .eq('opportunity_id', purchaseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-[#FFD700]" /></div>;
  }

  if (participants.length === 0) {
    return <p className="text-gray-400 text-sm p-4 text-center">Nenhum participante ainda.</p>;
  }

  return (
    <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-2">
      <h4 className="text-sm font-semibold text-white mb-2 border-b border-gray-800 pb-2">Lista de Participantes ({participants.length})</h4>
      {participants.map((p) => (
        <div key={p.id} className="flex justify-between items-center bg-black p-3 rounded-lg border border-gray-800">
          <div>
            <p className="text-sm font-medium text-white">{p.profiles?.full_name || 'Usuário Desconhecido'}</p>
            <p className="text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block">Qtd.</span>
            <span className="text-sm font-bold text-[#FFD700]">{p.quantity_interested}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
