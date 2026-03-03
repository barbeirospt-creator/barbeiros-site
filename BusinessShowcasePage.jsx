
import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { useBusinessShowcase } from '@/hooks/useBusinessShowcase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Pencil, Store, Image as ImageIcon, Briefcase, Star, MapPin, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet';

import BusinessInfoForm from '@/components/showcase/BusinessInfoForm';
import BusinessPhotoGallery from '@/components/showcase/BusinessPhotoGallery';
import PortfolioSection from '@/components/showcase/PortfolioSection';
import SpecialtiesSection from '@/components/showcase/SpecialtiesSection';
import LocationSection from '@/components/showcase/LocationSection';
import BusinessHoursSection from '@/components/showcase/BusinessHoursSection';

export default function BusinessShowcasePage() {
  const { data, loading, error, fetchData, updateInfo } = useBusinessShowcase();
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !data.info) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700]"></div>
        </div>
      </AppLayout>
    );
  }

  const { info, photos, portfolio, specialties, hours } = data;

  return (
    <AppLayout>
      <Helmet>
        <title>Meu Negócio - Showcase | Barbeiros PT</title>
        <meta name="description" content="Faça a gestão da montra do seu negócio de barbearia." />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        <div className="relative bg-gray-900 border border-gray-800 rounded-xl p-4 md:p-6 lg:p-10 overflow-hidden">
          <div className="relative z-10 flex flex-col gap-4 md:gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Store className="text-[#FFD700]" size={28} />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white break-words">
                  {info?.business_name || 'A Minha Barbearia'}
                </h1>
              </div>
              <p className="text-gray-400 text-sm md:text-base lg:text-lg">
                {info?.description || 'Adicione uma descrição para atrair mais clientes e destacar o seu espaço.'}
              </p>
            </div>
            <Button 
              onClick={() => setIsEditInfoOpen(true)} 
              className="bg-[#FFD700] text-black hover:bg-[#FFA500] w-full sm:w-auto"
            >
              <Pencil size={16} className="mr-2" /> Editar Info
            </Button>
          </div>
        </div>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="bg-black border border-gray-800 mb-6 md:mb-8 flex flex-wrap w-full h-auto p-1 gap-2 justify-start">
            <TabsTrigger value="gallery" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black text-gray-400 py-2 px-3 md:px-4 rounded-md text-xs md:text-sm">
              <ImageIcon size={14} className="mr-1 md:mr-2" /> Galeria
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black text-gray-400 py-2 px-3 md:px-4 rounded-md text-xs md:text-sm">
              <Briefcase size={14} className="mr-1 md:mr-2" /> Portefólio
            </TabsTrigger>
            <TabsTrigger value="specialties" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black text-gray-400 py-2 px-3 md:px-4 rounded-md text-xs md:text-sm">
              <Star size={14} className="mr-1 md:mr-2" /> Especialidades
            </TabsTrigger>
            <TabsTrigger value="location" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black text-gray-400 py-2 px-3 md:px-4 rounded-md text-xs md:text-sm">
              <MapPin size={14} className="mr-1 md:mr-2" /> Localização
            </TabsTrigger>
            <TabsTrigger value="hours" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black text-gray-400 py-2 px-3 md:px-4 rounded-md text-xs md:text-sm">
              <Clock size={14} className="mr-1 md:mr-2" /> Horários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="outline-none">
            <BusinessPhotoGallery photos={photos} businessId={info?.id} onRefresh={fetchData} />
          </TabsContent>

          <TabsContent value="portfolio" className="outline-none">
            <PortfolioSection items={portfolio} businessId={info?.id} onRefresh={fetchData} />
          </TabsContent>

          <TabsContent value="specialties" className="outline-none">
            <SpecialtiesSection specialties={specialties} businessId={info?.id} onRefresh={fetchData} />
          </TabsContent>

          <TabsContent value="location" className="outline-none">
            <LocationSection info={info} />
          </TabsContent>

          <TabsContent value="hours" className="outline-none">
            <BusinessHoursSection hours={hours} businessId={info?.id} onRefresh={fetchData} />
          </TabsContent>
        </Tabs>

        <BusinessInfoForm 
          isOpen={isEditInfoOpen} 
          onClose={() => setIsEditInfoOpen(false)} 
          initialData={info}
          onSave={updateInfo}
        />
      </div>
    </AppLayout>
  );
}
