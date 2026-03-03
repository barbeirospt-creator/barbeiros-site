import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export const PaymentAuditLog = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    async function fetchLogs() {
      const { data, error } = await supabase
        .from('tabela_transacoes')
        .select('*')
        .eq('usuario_id', user.id)
        .order('data', { ascending: false });

      if (!error) setLogs(data);
      setLoading(false);
    }
    fetchLogs();
  }, [user]);

  const filteredLogs = logs.filter(log => filter === 'all' || log.status === filter);

  if (loading) return <div className="p-8 text-center">A carregar histórico...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Histórico de Pagamentos</h2>
        <select 
          className="border rounded-md px-3 py-2 text-sm"
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos os estados</option>
          <option value="completed">Concluídos</option>
          <option value="pending">Pendentes</option>
          <option value="failed">Falhados</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Nenhum registo encontrado.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                    ${log.status === 'completed' ? 'bg-green-100 text-green-600' : 
                      log.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {log.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : 
                     log.status === 'failed' ? <AlertTriangle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{log.descricao}</p>
                    <p className="text-xs text-slate-500">{new Date(log.data).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{log.valor.toFixed(2)}€</p>
                  <p className="text-xs uppercase tracking-wide text-slate-400">{log.tipo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};