import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarberShopGallery } from '@/components/BarberShopGallery';
import { ReviewsSection } from '@/components/ReviewsSection';
import { ServicesAndPricing } from '@/components/ServicesAndPricing';
import { ReviewForm } from '@/components/ReviewForm';
import { AppointmentForm } from '@/components/AppointmentForm';
import { MapPin, Phone, Mail, Star, Share2, Heart, ShieldCheck } from 'lucide-react';
import { barbershopService } from '@/services/barbershopService';
import { reviewService } from '@/services/reviewService';
import { serviceService } from '@/services/serviceService';
import { imageService } from '@/services/imageService';

export const BarberShopProfile = () => {
  const { id } = useParams();
  const [barbershop, setBarbershop] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    const { data } = await reviewService.getReviewsByBarbershop(id);
    if(data) setReviews(data);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [shopRes, reviewRes, svcRes, imgRes] = await Promise.all([
          barbershopService.getBarbershopById(id),
          reviewService.getReviewsByBarbershop(id),
          serviceService.getServicesByBarbershop(id),
          imageService.getImagesByBarbershop(id)
        ]);

        if (shopRes.error) throw new Error('Falha ao carregar barbearia');
        
        setBarbershop(shopRes.data);
        setReviews(reviewRes.data || []);
        setServices(svcRes.data || []);
        setGallery(imgRes.data || []);
      } catch (err) {
        setError('Barbearia não encontrada');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">A carregar...</div>;
  if (error || !barbershop) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="relative h-64 md:h-80 lg:h-96">
        <img 
          src={barbershop.coverImage} 
          alt={barbershop.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 container mx-auto text-white">
          <div className="flex flex-col md:flex-row items-end gap-6">
            <div className="relative">
              <img src={barbershop.logo} alt="Logo" className="w-32 h-32 rounded-xl border-4 border-white bg-white object-cover" />
              {barbershop.isPremium && <ShieldCheck className="absolute -top-3 -right-3 w-8 h-8 text-yellow-500 bg-white rounded-full" />}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{barbershop.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm opacity-90">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {barbershop.location.city}</span>
                <span className="flex items-center gap-1 text-yellow-400"><Star className="w-4 h-4 fill-current" /> {barbershop.rating} ({reviews.length})</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="lg" onClick={() => document.getElementById('appointment-section').scrollIntoView({ behavior: 'smooth'})}>Agendar</Button>
              <Button variant="secondary" size="icon"><Heart className="w-5 h-5" /></Button>
              <Button variant="secondary" size="icon"><Share2 className="w-5 h-5" /></Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="services">
            <TabsList className="w-full justify-start border-b bg-transparent rounded-none h-auto p-0 gap-6">
              <TabsTrigger value="services" className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 py-3">Serviços</TabsTrigger>
              <TabsTrigger value="gallery" className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 py-3">Galeria</TabsTrigger>
              <TabsTrigger value="reviews" className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 py-3">Avaliações</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="services">
                <ServicesAndPricing services={services} barbershopName={barbershop.name} />
              </TabsContent>
              <TabsContent value="gallery">
                <BarberShopGallery images={gallery.length > 0 ? gallery : barbershop.gallery || []} />
              </TabsContent>
              <TabsContent value="reviews">
                <ReviewsSection reviews={reviews} rating={barbershop.rating} reviewCount={reviews.length} />
                <ReviewForm barbershopId={barbershop.id} onReviewAdded={fetchReviews} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div id="appointment-section">
             <AppointmentForm services={services} barbershopId={barbershop.id} />
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-lg mb-4">Contactos</h3>
            <div className="space-y-3 text-slate-600">
               <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary" /> {barbershop.contacts.phone || 'N/A'}</div>
               <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary" /> {barbershop.contacts.email || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};