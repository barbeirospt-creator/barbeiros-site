import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Check, X, Crown, Scissors } from 'lucide-react';

export const MembershipPlans = () => {
  const {
    user,
    membershipTier,
    upgradeToPremium,
    downgradeToFree
  } = useAuth();
  const navigate = useNavigate();

  const handlePlanChange = plan => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (plan === 'premium') {
      upgradeToPremium();
    } else {
      downgradeToFree();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Planos de Subscrição</h1>
          <p className="text-xl text-slate-600">Invista no seu futuro profissional</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden relative">
            {membershipTier === 'free' && user && (
              <div className="absolute top-0 inset-x-0 bg-slate-200 text-slate-700 text-xs font-bold text-center py-1">
                SEU PLANO ATUAL
              </div>
            )}
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Básico</h3>
                  <p className="text-slate-500">Para quem está a começar</p>
                </div>
                <Scissors className="w-8 h-8 text-slate-400" />
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-slate-900">0€</span>
                <span className="text-slate-500">/mês</span>
              </div>
              <Button 
                variant={membershipTier === 'free' ? "outline" : "default"} 
                className="w-full mb-8" 
                onClick={() => handlePlanChange('free')} 
                disabled={membershipTier === 'free'}
              >
                {membershipTier === 'free' ? 'Plano Atual' : 'Mudar para Básico'}
              </Button>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Perfil Profissional</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Acesso à Comunidade</span>
                </li>
                <li className="flex items-center gap-3 text-slate-700">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Agenda Básica</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <span>Vendas sem comissão</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <span>Dashboard Financeiro Avançado</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-400 overflow-hidden relative transform md:-translate-y-4">
            <div className="absolute top-0 inset-x-0 bg-yellow-400 text-yellow-900 text-xs font-bold text-center py-1">
              RECOMENDADO
            </div>
            {membershipTier === 'premium' && user && (
               <div className="absolute top-8 inset-x-0 bg-yellow-100 text-yellow-800 text-xs font-bold text-center py-1">
                 SEU PLANO ATUAL
               </div>
            )}
            <div className="p-8 pt-12">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Premium</h3>
                  <p className="text-slate-500">Para profissionais</p>
                </div>
                <Crown className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-slate-900">9,90€</span>
                <span className="text-slate-500">/mês</span>
              </div>
              <Button 
                className="w-full mb-8 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white border-0" 
                onClick={() => handlePlanChange('premium')} 
                disabled={membershipTier === 'premium'}
              >
                {membershipTier === 'premium' ? 'Plano Atual' : 'Atualizar para Premium'}
              </Button>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-900 font-medium">
                  <Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <span>Tudo do plano Básico</span>
                </li>
                <li className="flex items-center gap-3 text-slate-900 font-medium">
                  <Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <span>15% Comissão em Vendas</span>
                </li>
                <li className="flex items-center gap-3 text-slate-900 font-medium">
                  <Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <span>Loja Premium Ilimitada</span>
                </li>
                <li className="flex items-center gap-3 text-slate-900 font-medium">
                  <Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <span>Acesso a Pré-Compras</span>
                </li>
                <li className="flex items-center gap-3 text-slate-900 font-medium">
                  <Check className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <span>Descontos Exclusivos Parceiros</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};