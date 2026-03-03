
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Check, Loader2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';

const steps = ['Serviço', 'Data e Hora', 'Profissional', 'Confirmação'];

export const BookingWizard = ({ barbershopId, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [bookingData, setBookingData] = useState({
    service: null,
    date: new Date(),
    time: null,
    barber: null
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (barbershopId) {
      fetchServices();
      fetchStaff();
    }
  }, [barbershopId]);

  const fetchServices = async () => {
    const { data } = await supabase
      .from('tabela_servicos')
      .select('*')
      .eq('barbearia_id', barbershopId);
    setServices(data || []);
  };

  const fetchStaff = async () => {
    // Fetch users associated with this barbershop
    const { data } = await supabase
      .from('tabela_usuarios')
      .select('id, email, user_metadata') // Assuming metadata has name
      .eq('barbearia_id', barbershopId);
      
    // Mocking staff names if metadata is empty for demo
    const formattedStaff = data?.map(u => ({
        id: u.id,
        name: u.user_metadata?.name || u.email.split('@')[0] || 'Barbeiro'
    })) || [];
    
    setStaff(formattedStaff);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleBooking();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
        if (!user) {
            toast({ title: "Login necessário", description: "Faça login para agendar.", variant: "destructive" });
            navigate('/login');
            return;
        }

        const { error } = await supabase.from('tabela_agendamentos').insert({
            barbearia_id: barbershopId,
            cliente_nome: user.email, // Or user name
            servico: bookingData.service.nome_servico,
            data: bookingData.date.toISOString().split('T')[0],
            hora: bookingData.time,
            preco: bookingData.service.preco,
            status: 'pendente'
        });

        if (error) throw error;

        toast({ title: "Agendamento Criado!", description: "Aguarde a confirmação da barbearia." });
        navigate('/agendamentos');

    } catch (err) {
        console.error(err);
        toast({ title: "Erro", description: "Falha ao criar agendamento.", variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  // Mock time slots
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Service
        return (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-4">Escolha um serviço</h3>
            {services.length === 0 && <p className="text-slate-500">Nenhum serviço disponível.</p>}
            {services.map(service => (
              <Card 
                key={service.id} 
                className={`cursor-pointer transition-colors ${bookingData.service?.id === service.id ? 'border-primary bg-primary/5' : 'hover:bg-slate-50'}`}
                onClick={() => setBookingData({ ...bookingData, service })}
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{service.nome_servico}</p>
                    <p className="text-sm text-slate-500">{service.duracao} min</p>
                  </div>
                  <p className="font-bold">{service.preco}€</p>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case 1: // Date & Time
        return (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Escolha Data e Hora</h3>
            {/* Simple Date Input for Mobile */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Data</label>
                <Input 
                    type="date" 
                    className="w-full bg-white"
                    value={bookingData.date.toISOString().split('T')[0]}
                    onChange={(e) => setBookingData({...bookingData, date: new Date(e.target.value)})}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Horário</label>
                <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map(time => (
                        <Button 
                            key={time} 
                            variant={bookingData.time === time ? "default" : "outline"}
                            onClick={() => setBookingData({ ...bookingData, time })}
                            className="w-full"
                        >
                            {time}
                        </Button>
                    ))}
                </div>
            </div>
          </div>
        );
      case 2: // Barber
        return (
            <div className="space-y-3">
                <h3 className="font-semibold text-lg">Escolha o Profissional</h3>
                <Card 
                    className={`cursor-pointer ${!bookingData.barber ? 'border-primary bg-primary/5' : ''}`}
                    onClick={() => setBookingData({ ...bookingData, barber: null })}
                >
                    <CardContent className="p-4">
                        <p className="font-medium">Qualquer Profissional</p>
                        <p className="text-sm text-slate-500">Máxima disponibilidade</p>
                    </CardContent>
                </Card>
                {staff.map(barber => (
                    <Card 
                        key={barber.id}
                        className={`cursor-pointer ${bookingData.barber?.id === barber.id ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => setBookingData({ ...bookingData, barber })}
                    >
                        <CardContent className="p-4">
                            <p className="font-medium">{barber.name}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
      case 3: // Confirmation
        return (
            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Confirmar Agendamento</h3>
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-slate-500">Data</p>
                                <p className="font-medium">{bookingData.date.toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-sm text-slate-500">Horário</p>
                                <p className="font-medium">{bookingData.time}</p>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <div className="flex justify-between mb-1">
                                <span className="text-slate-600">{bookingData.service?.nome_servico}</span>
                                <span>{bookingData.service?.preco}€</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg mt-2">
                                <span>Total</span>
                                <span>{bookingData.service?.preco}€</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
      if (currentStep === 0 && !bookingData.service) return true;
      if (currentStep === 1 && (!bookingData.date || !bookingData.time)) return true;
      return false;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between bg-white">
        <Button variant="ghost" size="icon" onClick={handleBack}>
            <ChevronLeft className="w-6 h-6" />
        </Button>
        <div className="font-semibold">
            Passo {currentStep + 1} de {steps.length}
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {renderStep()}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-white safe-area-bottom">
        <Button 
            className="w-full h-12 text-lg" 
            onClick={handleNext} 
            disabled={isNextDisabled() || loading}
        >
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            {currentStep === steps.length - 1 ? 'Confirmar Agendamento' : 'Continuar'}
        </Button>
      </div>
    </div>
  );
};
