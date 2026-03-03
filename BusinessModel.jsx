import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight, DollarSign, Users, Briefcase } from 'lucide-react';

export const BusinessModel = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Modelo de Negócio Transparente</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Acreditamos na transparência total. Saiba como o Barbeiros.pt gera valor para a comunidade e sustenta o seu crescimento.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">1. Comunidade Gratuita</h3>
            <p className="text-slate-600">
              A base da nossa plataforma é gratuita. Qualquer barbeiro pode criar perfil, participar no fórum e aceder a ferramentas básicas sem custos.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <div className="bg-yellow-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <DollarSign className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">2. Subscrição Premium</h3>
            <p className="text-slate-600">
              Oferecemos ferramentas avançadas de gestão e vendas por uma mensalidade fixa. Sem custos escondidos, apenas valor acrescentado.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <div className="bg-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
              <Briefcase className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">3. Parcerias Estratégicas</h3>
            <p className="text-slate-600">
              Negociamos descontos em volume com fornecedores. Recebemos uma pequena comissão por referral que nos ajuda a manter a plataforma.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 mb-16">
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Estrutura de Comissões</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-4 text-primary">Para Membros Gratuitos</h3>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <span>Vendas no Marketplace</span>
                    <span className="font-bold text-slate-900">10% comissão</span>
                  </li>
                  <li className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <span>Agendamentos (Pagamento Online)</span>
                    <span className="font-bold text-slate-900">2.5% + 0.25€</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-yellow-600">Para Membros Premium</h3>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <span>Vendas no Marketplace</span>
                    <span className="font-bold text-green-600">0% comissão</span>
                  </li>
                  <li className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <span>Agendamentos (Pagamento Online)</span>
                    <span className="font-bold text-slate-900">Taxas standard Stripe</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Escolha o plano ideal para si</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
            Comece gratuitamente e evolua à medida que o seu negócio cresce. Sem fidelização, cancele quando quiser.
          </p>
          <Link to="/membership-plans">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 rounded-xl">
              Ver Planos e Preços <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};