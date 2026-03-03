import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { StripeCheckout } from '@/components/StripeCheckout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_live_cJ180iBeKVUsAXURG2WM29bU002HLZ4Mvb');

export const PaymentCheckout = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchAppointment() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('tabela_agendamentos')
          .select('*, tabela_barbearias(nome, localizacao)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setAppointment({
          id: data.id,
          serviceName: data.servico,
          price: data.preco,
          date: data.data,
          time: data.hora,
          barbershopName: data.tabela_barbearias?.nome,
          barbershopAddress: data.tabela_barbearias?.localizacao,
          barbershopId: data.barbearia_id
        });
      } catch (err) {
        setError("Agendamento não encontrado.");
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      if (!user) {
        navigate('/login', { state: { from: `/checkout/${id}` } });
      } else {
        fetchAppointment();
      }
    }
  }, [id, user, authLoading, navigate]);

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">A carregar...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h2>
          <p className="text-slate-600 mb-6">O seu agendamento foi finalizado com sucesso.</p>
          <Button onClick={() => navigate('/transactions')} className="w-full mb-2">Ver Recibo</Button>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">Voltar ao Painel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold mb-4">Resumo do Pedido</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-semibold">{appointment.serviceName}</h3>
                  <p className="text-sm text-slate-500">{appointment.barbershopName}</p>
                </div>
                <p className="font-bold">{appointment.price}€</p>
              </div>
              
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-primary" /> {new Date(appointment.date).toLocaleDateString('pt-PT')}
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-primary" /> {appointment.time}
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" /> {appointment.barbershopAddress}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center font-bold text-lg border-t border-slate-100">
                <span>Total a Pagar</span>
                <span>{appointment.price}€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-lg font-bold mb-6">Método de Pagamento</h2>
          <Elements stripe={stripePromise}>
            <StripeCheckout 
              appointment={appointment} 
              onSuccess={() => setSuccess(true)} 
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};