
import React, { useState, useEffect, useCallback } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/customSupabaseClient";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useToast } from "@/components/ui/use-toast";
import { EditableProfileForm } from "@/components/EditableProfileForm";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";
import ProfileSharingToggle from "@/components/ProfileSharingToggle";
import IntegrationsSection from "@/components/integrations/IntegrationsSection";
import { useBarberIntegrations } from "@/hooks/useBarberIntegrations";
import { motion } from "framer-motion";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  const {
    integrations,
    loading: integrationsLoading,
    error: integrationsError,
    fetchIntegrations,
    connectIntegration,
    disconnectGoogleBusiness,
    disconnectWhatsApp,
    disconnectBukAgenda,
    disconnectGoogleBusinessLink
  } = useBarberIntegrations();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchIntegrations();
    }
  }, [user, fetchIntegrations]);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error && error.code === "PGRST116") {
        const newProfile = {
          id: user.id,
          email: user.email,
          display_name: user.email?.split('@')[0] || 'Utilizador',
          created_at: new Date().toISOString(),
          is_shared: false
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert([newProfile])
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile);
      } else if (error) {
        throw error;
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError(err.message || 'Falha ao carregar perfil');
      toast({
        title: "Erro",
        description: "Falha ao carregar perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso.",
      });
    } catch (err) {
      console.error('Profile save error:', err);
      toast({
        title: "Erro",
        description: err.message || "Falha ao atualizar perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUploaded = (newPhotoUrl) => {
    setProfile(prev => ({ ...prev, avatar_url: newPhotoUrl }));
  };

  const handleConnectIntegration = useCallback(async (integrationName, credentials) => {
    console.log(`[ProfilePage] Iniciando handleConnectIntegration para ${integrationName}`, credentials);
    if (typeof connectIntegration !== 'function') {
      console.error('[ProfilePage] connectIntegration do hook não é uma função!');
      return { error: new Error('Erro interno: Função de conexão não está disponível.') };
    }
    try {
      const result = await connectIntegration(integrationName, credentials);
      return result;
    } catch (error) {
      console.error(`[ProfilePage] Erro ao conectar ${integrationName}:`, error);
      return { error };
    }
  }, [connectIntegration]);

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <div className="h-10 w-64 bg-gray-800 animate-pulse rounded-lg mb-8"></div>
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-2xl">
            <CardContent className="space-y-6 pt-8">
              <div className="flex justify-center">
                <div className="w-32 h-32 bg-gray-800 animate-pulse rounded-full"></div>
              </div>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-12 bg-gray-800 animate-pulse rounded-lg"></div>
              ))}
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  if (error && !profile) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-800/50 shadow-2xl">
            <CardContent className="py-12 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Erro ao Carregar Perfil</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button
                onClick={fetchProfile}
                className="bg-[#FFD700] text-black hover:bg-[#FFA500]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            O Seu <span className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] bg-clip-text text-transparent">Perfil</span>
          </h1>
          <p className="text-gray-400 mb-8">Gerir as suas informações pessoais e integrações</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800 shadow-2xl rounded-2xl overflow-hidden hover:shadow-[0_0_50px_rgba(255,215,0,0.15)] transition-all duration-500">
            <CardHeader className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
              <CardTitle className="text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-xl">Informação do Perfil</span>
                <div className="flex gap-2">
                  {profile?.is_premium && (
                    <Badge className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-semibold">
                      Premium
                    </Badge>
                  )}
                  {profile?.is_admin && (
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold">
                      Admin
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-8 px-4 sm:px-6 space-y-8">
              <div className="pb-8 border-b border-gray-800">
                <ProfilePhotoUpload
                  userId={user.id}
                  currentPhotoUrl={profile?.avatar_url}
                  onPhotoUploaded={handlePhotoUploaded}
                />
              </div>

              {profile && (
                <div className="pb-8 border-b border-gray-800">
                  <ProfileSharingToggle userId={user.id} initialShared={profile.is_shared} />
                </div>
              )}

              <EditableProfileForm
                initialData={profile}
                onSave={handleSave}
                loading={saving}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {integrationsError && !integrations ? (
            <Card className="bg-gradient-to-br from-red-900/20 to-black border-red-800/50 shadow-lg rounded-2xl overflow-hidden mt-8">
              <CardContent className="py-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-red-500/20 p-4 rounded-full">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Erro nas Integrações</h3>
                <p className="text-red-400 mb-6 font-medium">
                  Não foi possível carregar o seu painel de integrações.<br/>
                  <span className="text-sm text-red-400/80 font-normal mt-1 block">{integrationsError}</span>
                </p>
                <Button 
                  onClick={fetchIntegrations} 
                  variant="outline" 
                  className="gap-2 border-red-500/30 text-red-400 hover:bg-red-500/20"
                >
                  <RefreshCw className="w-4 h-4" />
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
              disconnectGoogleBusinessLink={disconnectGoogleBusinessLink}
            />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>Última atualização: {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('pt-PT') : 'Nunca'}</p>
        </motion.div>
      </div>
    </AppLayout>
  );
}
