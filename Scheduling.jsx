import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Clock, User, Scissors, Check } from 'lucide-react';

export const Scheduling = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  const services = [
    { id: 'corte', name: 'Corte de Cabelo', duration: '30min', price: '15€' },
    { id: 'barba', name: 'Barba', duration: '20min', price: '10€' },
    { id: 'combo', name: 'Corte + Barba', duration: '45min', price: '22€' },
    { id: 'tratamento', name: 'Tratamento Capilar', duration: '60min', price: '25€' }
  ];

  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];

  const handleBooking = (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime || !selectedService || !clientName || !clientPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Marcação confirmada! ✅",
      description: `${clientName} agendado para ${selectedDate} às ${selectedTime}`,
    });

    // Reset form
    setSelectedDate('');
    setSelectedTime('');
    setSelectedService('');
    setClientName('');
    setClientPhone('');
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
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Sistema de Agendamentos</h1>
          <p className="text-slate-600 text-lg mb-8">Gerir marcações de forma simples e eficaz</p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-primary" />
                Nova Marcação
              </h2>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nome do Cliente
                  </label>
                  <Input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome completo"
                    className="text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Telefone
                  </label>
                  <Input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+351 912 345 678"
                    className="text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Serviço
                  </label>
                  <div className="space-y-2">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedService === service.id
                            ? 'border-primary bg-primary/5'
                            : 'border-slate-200 hover:border-primary/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-slate-900">{service.name}</p>
                            <p className="text-sm text-slate-600">{service.duration}</p>
                          </div>
                          <span className="text-primary font-bold">{service.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Data
                  </label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Hora
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`p-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2">
                  <Check className="w-4 h-4" />
                  Confirmar Marcação
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Próximas Marcações</h3>
                <div className="space-y-3">
                  {[
                    { client: 'Carlos Silva', service: 'Corte + Barba', time: '10:00', date: 'Hoje' },
                    { client: 'Pedro Santos', service: 'Corte', time: '14:30', date: 'Hoje' },
                    { client: 'João Costa', service: 'Barba', time: '16:00', date: 'Amanhã' }
                  ].map((booking, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-slate-900">{booking.client}</p>
                          <p className="text-sm text-slate-600">{booking.service}</p>
                        </div>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          {booking.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        {booking.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                <h3 className="text-xl font-bold text-slate-900 mb-2">💡 Dica</h3>
                <p className="text-slate-700 text-sm">
                  Ative as notificações para receber lembretes automáticos das suas marcações!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};