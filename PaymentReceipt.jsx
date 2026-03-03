import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { paymentService } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import { Printer, Download, ArrowLeft, CheckCircle } from 'lucide-react';

export const PaymentReceipt = () => {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await paymentService.getTransactionById(transactionId);
        setTransaction(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [transactionId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">A carregar recibo...</div>;
  if (!transaction) return <div className="min-h-screen flex items-center justify-center">Recibo não encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
           <Link to="/transactions" className="text-slate-600 hover:text-slate-900 flex items-center gap-2">
             <ArrowLeft className="w-4 h-4" /> Voltar
           </Link>
           <div className="flex gap-2">
             <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
               <Printer className="w-4 h-4" /> Imprimir
             </Button>
           </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 print:shadow-none print:border-none" id="receipt-content">
          <div className="flex justify-between items-start border-b border-slate-100 pb-8 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Recibo</h1>
              <p className="text-slate-500 mt-1">ID: #{transaction.id.slice(0, 8)}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-primary">Barbeiros.pt</div>
              <p className="text-sm text-slate-500">Plataforma de Agendamentos</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-sm text-slate-500 mb-1">Pagamento de</p>
              <p className="font-medium text-slate-900">Utilizador #{transaction.usuario_id?.slice(0,8)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">Data</p>
              <p className="font-medium text-slate-900">{new Date(transaction.data).toLocaleDateString('pt-PT')}</p>
              <p className="text-sm text-slate-500">{new Date(transaction.data).toLocaleTimeString('pt-PT')}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
              <span className="font-medium">Descrição</span>
              <span className="font-medium">Valor</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-700">{transaction.descricao}</span>
              <span className="text-slate-900 font-bold">{transaction.valor.toFixed(2)}€</span>
            </div>
            {transaction.status === 'completed' && (
               <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
                 <CheckCircle className="w-4 h-4" /> Pago via Cartão de Crédito
               </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-slate-100">
             <div className="text-sm text-slate-500">
               Obrigado pela sua preferência.
             </div>
             <div className="text-right">
               <p className="text-sm text-slate-500">Total</p>
               <p className="text-3xl font-bold text-slate-900">{transaction.valor.toFixed(2)}€</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};