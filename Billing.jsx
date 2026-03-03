import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { DollarSign, Download, FileText, TrendingUp, Calculator, Scissors } from 'lucide-react';

export const Billing = () => {
  const { toast } = useToast();
  const [calculatorValues, setCalculatorValues] = useState({
    service: '',
    quantity: 1,
    price: 0
  });

  const monthlyStats = {
    revenue: '2,450€',
    expenses: '680€',
    profit: '1,770€',
    invoices: 87
  };

  const recentInvoices = [
    { id: 'INV-001', client: 'Carlos Silva', amount: '25€', date: '25 Jan 2026', status: 'Pago' },
    { id: 'INV-002', client: 'Pedro Santos', amount: '15€', date: '24 Jan 2026', status: 'Pago' },
    { id: 'INV-003', client: 'João Costa', amount: '22€', date: '23 Jan 2026', status: 'Pendente' }
  ];

  const handleGenerateInvoice = () => {
    toast({
      title: "Fatura gerada! 📄",
      description: "A sua fatura foi criada e está pronta para download.",
    });
  };

  const calculateTotal = () => {
    return (calculatorValues.quantity * calculatorValues.price).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Scissors className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-slate-900">Barbeiros.pt</span>
            </div>
            <Button onClick={() => window.history.back()} variant="ghost">Voltar</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Gestão Financeira</h1>
          <p className="text-slate-600 text-lg mb-8">Controle completo das suas finanças</p>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Receita Mensal', value: monthlyStats.revenue, icon: <TrendingUp className="w-6 h-6" />, color: 'bg-green-500' },
              { label: 'Despesas', value: monthlyStats.expenses, icon: <DollarSign className="w-6 h-6" />, color: 'bg-red-500' },
              { label: 'Lucro Líquido', value: monthlyStats.profit, icon: <DollarSign className="w-6 h-6" />, color: 'bg-blue-500' },
              { label: 'Faturas Emitidas', value: monthlyStats.invoices, icon: <FileText className="w-6 h-6" />, color: 'bg-purple-500' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-600 text-sm">{stat.label}</p>
                  <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center text-white`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Gerar Fatura
              </h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cliente</label>
                  <Input placeholder="Nome do cliente" className="text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Serviço</label>
                  <Input placeholder="Descrição do serviço" className="text-gray-900" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantidade</label>
                    <Input type="number" min="1" defaultValue="1" className="text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preço (€)</label>
                    <Input type="number" step="0.01" placeholder="0.00" className="text-gray-900" />
                  </div>
                </div>
                <Button onClick={handleGenerateInvoice} type="button" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Gerar e Descarregar Fatura
                </Button>
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-primary" />
                Calculadora de Preços
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Serviço</label>
                  <Input
                    placeholder="Ex: Corte + Barba"
                    value={calculatorValues.service}
                    onChange={(e) => setCalculatorValues({...calculatorValues, service: e.target.value})}
                    className="text-gray-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantidade</label>
                    <Input
                      type="number"
                      min="1"
                      value={calculatorValues.quantity}
                      onChange={(e) => setCalculatorValues({...calculatorValues, quantity: parseInt(e.target.value) || 1})}
                      className="text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Preço Unit. (€)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={calculatorValues.price}
                      onChange={(e) => setCalculatorValues({...calculatorValues, price: parseFloat(e.target.value) || 0})}
                      className="text-gray-900"
                    />
                  </div>
                </div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm text-slate-600 mb-1">Total</p>
                  <p className="text-3xl font-bold text-primary">{calculateTotal()}€</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Faturas Recentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-slate-700 font-semibold">ID</th>
                    <th className="text-left py-3 px-4 text-slate-700 font-semibold">Cliente</th>
                    <th className="text-left py-3 px-4 text-slate-700 font-semibold">Valor</th>
                    <th className="text-left py-3 px-4 text-slate-700 font-semibold">Data</th>
                    <th className="text-left py-3 px-4 text-slate-700 font-semibold">Estado</th>
                    <th className="text-left py-3 px-4 text-slate-700 font-semibold">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-900">{invoice.id}</td>
                      <td className="py-3 px-4 text-slate-900">{invoice.client}</td>
                      <td className="py-3 px-4 text-slate-900 font-semibold">{invoice.amount}</td>
                      <td className="py-3 px-4 text-slate-600">{invoice.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          invoice.status === 'Pago' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};