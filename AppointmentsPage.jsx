
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Calendar, Clock, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from('tabela_agendamentos')
        .select('*')
        .order('data', { ascending: true });
        
      if (err) throw err;
      setAppointments(data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Não foi possível carregar a sua agenda.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    toast({
      title: "Em breve",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Helmet>
        <title>A Minha Agenda | Barbeiros PT</title>
        <meta name="description" content="Faça a gestão dos seus agendamentos e horários." />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="text-[#FFD700] h-6 w-6" />
            Agenda
          </h1>
          <p className="text-gray-400 text-sm mt-1">Gira as suas marcações ativas</p>
        </div>
        <Button onClick={handleAction} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
          Novo Agendamento
        </Button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 flex items-start gap-3 mb-6">
          <AlertCircle className="text-red-500 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Sem marcações</h3>
          <p className="text-gray-400">Ainda não existem agendamentos registados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => (
            <Card key={apt.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardContent className="p-4 flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{apt.cliente_nome || 'Cliente não identificado'}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock size={14} className="text-[#FFD700]" />
                    <span>{apt.data} {apt.hora && `às ${apt.hora}`}</span>
                  </div>
                  {apt.servico && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin size={14} className="text-[#FFD700]" />
                      <span>{apt.servico}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:items-end justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === 'confirmado' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                    {apt.status || 'Pendente'}
                  </span>
                  <Button variant="outline" size="sm" onClick={handleAction} className="mt-4 border-gray-700 text-gray-300">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
