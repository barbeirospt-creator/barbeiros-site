import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function BusinessHoursSection({ hours, businessId, onRefresh }) {
  const { toast } = useToast();
  
  const days = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  const getDayHours = (day) => {
    return hours.find(h => h.day_of_week === day);
  };

  const handleEditStub = () => {
    toast({ title: "🚧 Configurar Horário", description: "O editor de horários detalhado será implementado na próxima versão." });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Horário de Funcionamento</h2>
        <Button variant="outline" onClick={handleEditStub} className="border-gray-700 text-gray-300 hover:text-white">
          <Clock size={16} className="mr-2" /> Editar Horário
        </Button>
      </div>

      <Card className="bg-gray-900 border-gray-800 overflow-hidden">
        <div className="divide-y divide-gray-800">
          {days.map((day, idx) => {
            const dayData = getDayHours(day);
            const isToday = new Date().getDay() === (idx + 1 === 7 ? 0 : idx + 1); // JS getDay: 0=Sun, 1=Mon
            
            return (
              <div key={day} className={`flex justify-between items-center p-4 ${isToday ? 'bg-black/50' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className={`font-medium ${isToday ? 'text-[#FFD700]' : 'text-gray-300'}`}>
                    {day}
                  </span>
                  {isToday && <span className="text-[10px] bg-[#FFD700]/20 text-[#FFD700] px-2 py-0.5 rounded uppercase font-bold">Hoje</span>}
                </div>
                
                <div className="text-gray-400">
                  {dayData ? (
                    dayData.is_closed ? (
                      <span className="text-red-400">Fechado</span>
                    ) : (
                      <span>{dayData.opening_time?.slice(0,5) || '--:--'} - {dayData.closing_time?.slice(0,5) || '--:--'}</span>
                    )
                  ) : (
                    <span className="text-gray-600">Não configurado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}