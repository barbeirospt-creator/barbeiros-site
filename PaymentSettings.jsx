import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  CreditCard, 
  Settings, 
  DollarSign, 
  Landmark, 
  History, 
  Download,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export const PaymentSettings = () => {
  const { membershipTier } = useAuth();
  const { toast } = useToast();
  const [stripeConnected, setStripeConnected] = useState(false);
  const [autoTransfer, setAutoTransfer] = useState(true);

  if (membershipTier !== 'premium') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <div className="max-w-md text-center">
          <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Configurações de Pagamento</h2>
          <p className="text-slate-600 mb-6">A gestão de pagamentos Stripe é exclusiva para membros Premium.</p>
          <Button onClick={() => window.history.back()}>Voltar</Button>
        </div>
      </div>
    );
  }

  const handleConnectStripe = () => {
    // In production: redirect to Stripe Connect OAuth
    setStripeConnected(true);
    toast({
      title: "Stripe Conectado!",
      description: "A sua conta Stripe foi vinculada com sucesso.",
    });
  };

  const handleManualTransfer = () => {
    toast({
      title: "Transferência Solicitada",
      description: "O valor será depositado na sua conta em até 2 dias úteis.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            Configurações de Pagamento
          </h1>
          <p className="text-slate-600 ml-11">Gerir conta Stripe, comissões e recebimentos.</p>
        </div>

        <div className="grid gap-6">
          {/* Stripe Connection Status */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Estado da Conexão
            </h2>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50 p-6 rounded-lg border border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stripeConnected ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">
                    {stripeConnected ? 'Conta Stripe Conectada' : 'Nenhuma conta conectada'}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {stripeConnected ? 'ID: acct_123456789' : 'Conecte sua conta para receber pagamentos'}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleConnectStripe}
                disabled={stripeConnected}
                className={stripeConnected ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}
              >
                {stripeConnected ? 'Conectado' : 'Conectar com Stripe'}
              </Button>
            </div>
          </div>

          {/* Commission & Transfers */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                Saldo Disponível
              </h2>
              <div className="text-3xl font-bold text-slate-900 mb-2">450,25 €</div>
              <p className="text-sm text-slate-500 mb-6">Disponível para transferência</p>
              
              <Button onClick={handleManualTransfer} className="w-full" variant="outline">
                Solicitar Transferência
              </Button>
              
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-slate-600">Transferência Automática</span>
                <button 
                  onClick={() => setAutoTransfer(!autoTransfer)}
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${autoTransfer ? 'bg-primary' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${autoTransfer ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Taxas e Comissões
              </h2>
              <ul className="space-y-4">
                <li className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Comissão da Plataforma</span>
                  <span className="font-bold text-green-600">0% (Premium)</span>
                </li>
                <li className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Taxas de Processamento (Stripe)</span>
                  <span className="font-bold text-slate-900">1.5% + 0.25€</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-slate-600" />
              Histórico Recente
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-500 border-b">
                    <th className="pb-3 font-medium">Data</th>
                    <th className="pb-3 font-medium">Descrição</th>
                    <th className="pb-3 font-medium">Valor</th>
                    <th className="pb-3 font-medium">Estado</th>
                    <th className="pb-3 font-medium text-right">Recibo</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {[
                    { date: '28/01/2026', desc: 'Venda #1234 - Pomada', amount: '+15.00€', status: 'Concluído' },
                    { date: '27/01/2026', desc: 'Agendamento #882', amount: '+25.00€', status: 'Concluído' },
                    { date: '25/01/2026', desc: 'Transferência para Banco', amount: '-150.00€', status: 'Processando' },
                  ].map((tx, i) => (
                    <tr key={i} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="py-3 text-slate-600">{tx.date}</td>
                      <td className="py-3 font-medium text-slate-900">{tx.desc}</td>
                      <td className={`py-3 font-bold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-slate-900'}`}>
                        {tx.amount}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.status === 'Concluído' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4 text-slate-400 hover:text-primary" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};