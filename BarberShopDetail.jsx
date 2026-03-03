import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Phone, Share2, ChevronLeft } from 'lucide-react';
import { BookingWizard } from '@/components/booking/BookingWizard';
import { useToast } from '@/components/ui/use-toast';

export const BarberShopDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barbershop, setBarbershop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [services, setServices] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBarbershopDetails();
  }, [id]);

  const fetchBarbershopDetails = async () => {
    try {
      const { data: shop, error } = await supabase
        .from('tabela_barbearias')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setBarbershop(shop);

      const { data: srv } = await supabase
        .from('tabela_servicos')
        .select('*')
        .eq('barbearia_id', id);
      setServices(srv || []);

    } catch (err) {
      console.error(err);
      toast({ title: "Erro", description: "Barbearia não encontrada.", variant: "destructive" });
      navigate('/mobile/home');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center">A carregar...</div>;
  if (!barbershop) return null;

  return (
    <div className="pb-24 bg-white min-h-screen">
      {showBooking && (
        <BookingWizard 
            barbershopId={id} 
            onCancel={() => setShowBooking(false)} 
        />
      )}

      {/* Hero Header */}
      <div className="relative h-64 bg-slate-900">
        <img 
            src={barbershop.logo || "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80"} 
            alt={barbershop.nome}
            className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-4 left-4 z-10">
            <Button variant="secondary" size="icon" className="rounded-full bg-white/90" onClick={() => navigate(-1)}>
                <ChevronLeft className="w-6 h-6" />
            </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
            <h1 className="text-2xl font-bold">{barbershop.nome}</h1>
            <div className="flex items-center gap-1 text-sm mt-1">
                <MapPin className="w-4 h-4 text-slate-300" />
                <span className="truncate">{barbershop.localizacao}</span>
            </div>
        </div>
      </div>

      {/* Info Stats */}
      <div className="flex divide-x border-b">
        <div className="flex-1 p-3 text-center">
            <div className="flex items-center justify-center gap-1 font-bold">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {barbershop.avaliacao_media || "4.8"}
            </div>
            <p className="text-xs text-slate-500">Avaliação</p>
        </div>
        <div className="flex-1 p-3 text-center">
            <div className="font-bold">1.2km</div>
            <p className="text-xs text-slate-500">Distância</p>
        </div>
        <div className="flex-1 p-3 text-center">
            <div className="font-bold text-green-600">Aberto</div>
            <p className="text-xs text-slate-500">Agora</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Actions */}
        <div className="flex gap-3">
            <Button className="flex-1" onClick={() => setShowBooking(true)}>Agendar Agora</Button>
            <Button variant="outline" size="icon"><Share2 className="w-5 h-5" /></Button>
            <Button variant="outline" size="icon"><Phone className="w-5 h-5" /></Button>
        </div>

        {/* Services */}
        <div>
            <h2 className="font-bold text-lg mb-3">Serviços</h2>
            <div className="space-y-3">
                {services.map(service => (
                    <div key={service.id} className="flex justify-between items-center p-3 border rounded-lg bg-slate-50">
                        <div>
                            <p className="font-medium">{service.nome_servico}</p>
                            <p className="text-xs text-slate-500">{service.duracao} min • {service.descricao}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">{service.preco}€</p>
                            <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={() => setShowBooking(true)}>
                                Reservar
                            </Button>
                        </div>
                    </div>
                ))}
                {services.length === 0 && <p className="text-slate-500 text-sm">Nenhum serviço listado.</p>}
            </div>
        </div>

        {/* About */}
        <div>
            <h2 className="font-bold text-lg mb-2">Sobre</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
                {barbershop.descricao || "Barbearia moderna com profissionais qualificados oferecendo os melhores cortes e tratamentos da região."}
            </p>
        </div>
      </div>
    </div>
  );
};