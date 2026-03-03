
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Helmet } from 'react-helmet';
import { MapPin, Star, Phone, Globe, ArrowLeft, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layouts/AppLayout';
import GoogleBusinessBadge from '@/components/community/GoogleBusinessBadge';
import GoogleBusinessSection from '@/components/community/GoogleBusinessSection';
import { useToast } from '@/components/ui/use-toast';

export default function BarberProfileDetailPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarberProfile();
  }, [id]);

  const fetchBarberProfile = async () => {
    try {
      setLoading(true);
      console.log(`[DEBUG] Fetching BarberProfileDetailPage for ID: ${id}`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      console.log('[DEBUG] Successfully fetched raw profile data:', data);
      
      // Specifically log Google Business columns to verify data persistence
      console.log('[DEBUG] Google Business Columns:', {
        google_business_link: data.google_business_link,
        google_business_name: data.google_business_name,
        google_business_location: data.google_business_location,
        google_business_rating: data.google_business_rating,
        google_business_reviews_count: data.google_business_reviews_count,
        google_business_photo: data.google_business_photo,
        google_business_description: data.google_business_description,
        google_business_phone: data.google_business_phone,
        google_business_website: data.google_business_website
      });

      const hasGoogleData = !!data.google_business_link;

      const structuredProfile = {
        ...data,
        googleData: hasGoogleData ? {
          google_business_name: data.google_business_name,
          google_business_location: data.google_business_location,
          google_business_rating: data.google_business_rating,
          google_business_reviews_count: data.google_business_reviews_count,
          google_business_photo: data.google_business_photo,
          google_business_description: data.google_business_description,
          google_business_phone: data.google_business_phone,
          google_business_website: data.google_business_website,
          google_business_link: data.google_business_link,
          buk_booking_link: data.buk_booking_link || null
        } : null
      };
      
      console.log('[DEBUG] Structured Profile state to be set:', structuredProfile);
      setProfile(structuredProfile);
      
    } catch (err) {
      console.error('[DEBUG] Error fetching profile:', err);
      toast({
        variant: "destructive",
        title: "Erro ao carregar",
        description: "Não foi possível carregar os detalhes do barbeiro."
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!profile) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Perfil não encontrado</h2>
          <Button asChild className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
            <Link to="/comunidade-barbers">Voltar à Comunidade</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const gData = profile.googleData || {};
  // Relaxed the check to rely on the link existence, allowing partial data to render
  const isGoogleSynced = !!gData.google_business_link;
  
  console.log('[DEBUG] Render constraints:', { isGoogleSynced, gData });
  
  const displayName = (isGoogleSynced && gData.google_business_name) ? gData.google_business_name : (profile.display_name || profile.full_name || 'Barbeiro');
  const location = (isGoogleSynced && gData.google_business_location) ? gData.google_business_location : profile.city;
  const description = profile.bio;
  const heroImage = (isGoogleSynced && gData.google_business_photo) ? gData.google_business_photo : profile.avatar_url;
  const rating = isGoogleSynced ? gData.google_business_rating : null;
  const reviewsCount = isGoogleSynced ? gData.google_business_reviews_count : null;
  const phone = profile.phone;
  const website = null;
  const bukLink = profile.buk_booking_link;

  return (
    <AppLayout>
      <Helmet>
        <title>{displayName} | Perfil do Barbeiro</title>
      </Helmet>

      <div className="max-w-5xl mx-auto pb-20 p-4 sm:p-6">
        <Button asChild variant="ghost" className="mb-6 text-gray-400 hover:text-white hover:bg-gray-900">
          <Link to="/comunidade-barbers"><ArrowLeft className="w-4 h-4 mr-2"/> Voltar à Comunidade</Link>
        </Button>

        <div className="bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* Hero Image Section */}
          <div className="h-64 sm:h-80 bg-gray-900 relative">
            {heroImage ? (
              <img src={heroImage} alt={displayName} className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                <span className="text-6xl text-gray-700 font-bold">{displayName.charAt(0)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">{displayName}</h1>
                    {isGoogleSynced && gData.google_business_name && <GoogleBusinessBadge showText={false} />}
                  </div>
                  
                  {location && (
                    <div className="flex items-center text-gray-300 gap-1.5 font-medium">
                      <MapPin className="w-5 h-5 text-[#FFD700]" />
                      {location}
                    </div>
                  )}
                </div>

                {rating && (
                  <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-700 flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-[#FFD700] fill-[#FFD700]" />
                      <span className="text-xl font-bold text-white">{rating}</span>
                    </div>
                    <span className="text-sm text-gray-400 border-l border-gray-600 pl-3">
                      {reviewsCount} avaliações
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Sobre</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {description || 'Nenhuma descrição fornecida.'}
                </p>
              </section>

              {/* Google Business Section Integration */}
              {isGoogleSynced && (
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Informação Oficial do Google</h3>
                  {console.log('[DEBUG] Rendering GoogleBusinessSection with data:', profile.googleData)}
                  <GoogleBusinessSection data={profile.googleData} />
                </section>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 space-y-4">
                <h3 className="font-bold text-white text-lg mb-4">Contactos Pessoais</h3>
                
                {phone && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase">Telefone</p>
                      <a href={`tel:${phone}`} className="hover:text-white transition-colors">{phone}</a>
                    </div>
                  </div>
                )}

                {website && (
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-gray-500 font-medium uppercase">Website</p>
                      <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD700] transition-colors truncate block text-sm">
                        {website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                {!phone && !website && (
                  <p className="text-sm text-gray-500">Nenhum contacto pessoal fornecido.</p>
                )}
              </div>

              {bukLink && (
                <Button asChild className="w-full bg-[#FFD700] text-black hover:bg-[#FFA500] font-bold h-12">
                  <a href={bukLink} target="_blank" rel="noopener noreferrer">
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar Marcação
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
