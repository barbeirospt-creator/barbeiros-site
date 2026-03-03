
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useBarberIntegrations } from '@/hooks/useBarberIntegrations';
import { Edit, Save, Star, MapPin, Phone, Mail, Scissors, User, Link, Loader2, RefreshCw } from 'lucide-react';
import IntegrationsSection from '@/components/integrations/IntegrationsSection';
import { Card, CardContent } from '@/components/ui/card';

export default function BarberProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('perfil');
  
  const { 
    integrations, 
    loading: integrationsLoading, 
    error: integrationsError, 
    fetchIntegrations,
    connectIntegration,
    disconnectGoogleBusiness,
    disconnectWhatsApp,
    disconnectBukAgenda
  } = useBarberIntegrations();

  useEffect(() => {
    if (activeTab === 'integracoes') {
      fetchIntegrations();
    }
  }, [activeTab, fetchIntegrations]);

  const handleConnectIntegration = useCallback(async (integrationName, credentials) => {
    console.log(`[BarberProfile] Iniciando handleConnectIntegration para ${integrationName}`, credentials);
    if (typeof connectIntegration !== 'function') {
      console.error('[BarberProfile] connectIntegration do hook não é uma função!');
      return { error: new Error('Erro interno: Função de conexão não está disponível.') };
    }
    try {
      const result = await connectIntegration(integrationName, credentials);
      return result;
    } catch (error) {
      console.error(`[BarberProfile] Erro ao conectar ${integrationName}:`, error);
      return { error };
    }
  }, [connectIntegration]);

  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || 'João Silva',
    barbershop: user?.user_metadata?.barbershop || 'Barbearia Premium',
    bio: 'Barbeiro profissional com 10 anos de experiência. Especializado em cortes clássicos e modernos.',
    phone: '+351 912 345 678',
    email: user?.email || '',
    location: 'Lisboa, Portugal',
    services: ['Corte de Cabelo', 'Barba', 'Sobrancelhas', 'Tratamento Capilar'],
    pricing: {
      corte: '15€',
      barba: '10€',
      sobrancelhas: '5€',
      tratamento: '25€'
    }
  });

  const portfolioImages = [
    'https://images.unsplash.com/photo-1703792686658-24e62d626ed2',
    'https://images.unsplash.com/photo-1678356163587-6bb3afb89679',
    'https://images.unsplash.com/photo-1695173122226-3a932002ab33',
    'https://images.unsplash.com/photo-1622286342621-4bd786c2447c'
  ];

  const reviews = [
    { name: 'Carlos M.', rating: 5, comment: 'Excelente profissional! Muito atencioso e caprichoso.', date: '15 Jan 2026' },
    { name: 'Pedro L.', rating: 5, comment: 'Melhor barbeiro da zona. Recomendo!', date: '10 Jan 2026' },
    { name: 'André S.', rating: 4, comment: 'Muito bom trabalho, voltarei com certeza.', date: '5 Jan 2026' }
  ];

  const handleSave = () => {
    toast({
      title: "Perfil atualizado!",
      description: "As suas alterações foram guardadas com sucesso.",
    });
    setIsEditing(false);
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
            <Button onClick={() => window.history.back()} variant="ghost" className="text-gray-700 hover:bg-gray-100">Voltar</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
            <div className="h-48 bg-gradient-to-r from-primary to-primary/80"></div>
            <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start -mt-20">
                <div className="bg-white rounded-2xl p-2 shadow-xl border border-gray-50">
                  <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center">
                    <User className="w-16 h-16 text-slate-400" />
                  </div>
                </div>
                
                <div className="flex-1 mt-24 md:mt-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="text-xl font-bold text-gray-900 bg-white"
                      />
                      <Input
                        value={profile.barbershop}
                        onChange={(e) => setProfile({...profile, barbershop: e.target.value})}
                        className="text-gray-900 bg-white"
                      />
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="w-full p-3 border rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                        rows="3"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
                      <p className="text-lg text-primary font-medium mb-2">{profile.barbershop}</p>
                      <p className="text-slate-600 mb-4 leading-relaxed">{profile.bio}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {profile.location}
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                          <Phone className="w-4 h-4 text-slate-400" />
                          {profile.phone}
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                          <Mail className="w-4 h-4 text-slate-400" />
                          {profile.email}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Button
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar Alterações
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Editar Perfil
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="px-8 border-t border-gray-100 flex gap-8 bg-slate-50/50">
              <button 
                onClick={() => setActiveTab('perfil')}
                className={`py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'perfil' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <User size={16} />
                Visão Geral
              </button>
              <button 
                onClick={() => setActiveTab('integracoes')}
                className={`py-4 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'integracoes' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                <Link size={16} />
                Integrações
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'perfil' ? (
              <>
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-2">Serviços</h2>
                    <div className="space-y-3">
                      {profile.services.map((service, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg">
                          <span className="font-medium text-slate-700">{service}</span>
                          <span className="text-primary font-bold">
                            {profile.pricing[service.toLowerCase().split(' ')[0]] || 'Consultar'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-2">Últimas Avaliações</h2>
                    <div className="flex items-center gap-3 mb-6 bg-slate-50 p-4 rounded-lg">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-lg font-bold text-slate-900">4.9</span>
                      <span className="text-slate-500 text-sm">/ 5.0</span>
                    </div>
                    <div className="space-y-5">
                      {reviews.slice(0, 2).map((review, index) => (
                        <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-slate-900">{review.name}</span>
                            <span className="text-xs text-slate-400">{review.date}</span>
                          </div>
                          <div className="flex gap-1 mb-2">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm text-slate-600 italic">"{review.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-2">Portfólio de Trabalhos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {portfolioImages.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer"
                      >
                        <img src={image} alt={`Trabalho ${index + 1}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {integrationsLoading && !integrations ? (
                  <Card className="bg-white border-gray-100 shadow-lg rounded-2xl overflow-hidden mt-8">
                    <CardContent className="py-12 px-6 flex flex-col items-center justify-center min-h-[300px]">
                      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                      <p className="text-slate-500 font-medium">A configurar o seu painel de integrações...</p>
                    </CardContent>
                  </Card>
                ) : integrationsError && !integrations ? (
                  <Card className="bg-white border-gray-100 shadow-lg rounded-2xl overflow-hidden mt-8">
                    <CardContent className="py-12 px-6 flex flex-col items-center justify-center min-h-[300px]">
                      <div className="bg-red-50 p-4 rounded-full mb-4">
                        <RefreshCw className="w-8 h-8 text-red-500" />
                      </div>
                      <p className="text-red-600 mb-6 text-center font-medium">Não foi possível carregar as integrações.<br/><span className="text-sm text-red-400 font-normal">{integrationsError}</span></p>
                      <Button onClick={fetchIntegrations} variant="outline" className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
                        Tentar Novamente
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <IntegrationsSection 
                    integrations={integrations}
                    loading={integrationsLoading}
                    onConnect={handleConnectIntegration}
                    disconnectGoogleBusiness={disconnectGoogleBusiness}
                    disconnectWhatsApp={disconnectWhatsApp}
                    disconnectBukAgenda={disconnectBukAgenda}
                  />
                )}
              </>
            )}
          </motion.div>

        </div>
      </main>
    </div>
  );
}
