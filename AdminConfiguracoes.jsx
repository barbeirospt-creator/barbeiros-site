
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import SettingsForm from '@/components/admin/SettingsForm';
import ColorPicker from '@/components/admin/ColorPicker';
import SocialMediaInput from '@/components/admin/SocialMediaInput';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { Loader2, Mail } from 'lucide-react';

export default function AdminConfiguracoes() {
  const { settings, loading, saveSettings, resetToDefaults, testEmailConfiguration } = useAdminSettings();
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleApiKeyChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      api_keys: { ...(prev.api_keys || {}), [key]: value }
    }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    await saveSettings(formData);
    setIsSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Configurações | Admin</title>
      </Helmet>
      
      <div className="space-y-6 max-w-5xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white">Configurações do Sistema</h1>
          <p className="text-gray-400 mt-1">Gerencie as configurações globais da plataforma.</p>
        </div>

        <Tabs defaultValue="branding" className="w-full">
          <TabsList className="bg-gray-900 border border-gray-800 flex flex-wrap h-auto mb-6">
            <TabsTrigger value="branding" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">Branding</TabsTrigger>
            <TabsTrigger value="email" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">Email e Notificações</TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">Pagamento</TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">Redes Sociais</TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">Contacto</TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-[#FFD700] data-[state=active]:text-black">Geral</TabsTrigger>
          </TabsList>

          <div className="bg-black border border-gray-800 rounded-xl p-6 shadow-sm">
            <SettingsForm onSubmit={handleSubmit} onReset={resetToDefaults} isLoading={isSaving}>
              
              {/* BRANDING TAB */}
              <TabsContent value="branding" className="space-y-6 mt-0">
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Identidade Visual</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">URL do Logotipo</label>
                    <Input 
                      value={formData.logo_url || ''} 
                      onChange={(e) => handleChange('logo_url', e.target.value)} 
                      className="bg-gray-900 border-gray-700 text-white" 
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Família de Fontes</label>
                    <select 
                      value={formData.font_family || 'Inter'} 
                      onChange={(e) => handleChange('font_family', e.target.value)}
                      className="w-full bg-gray-900 border-gray-700 text-white rounded-md h-10 px-3"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Poppins">Poppins</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <ColorPicker label="Cor Principal" value={formData.primary_color} onChange={(v) => handleChange('primary_color', v)} />
                  <ColorPicker label="Cor Secundária" value={formData.secondary_color} onChange={(v) => handleChange('secondary_color', v)} />
                  <ColorPicker label="Cor de Destaque" value={formData.accent_color} onChange={(v) => handleChange('accent_color', v)} />
                </div>
              </TabsContent>

              {/* EMAIL TAB */}
              <TabsContent value="email" className="space-y-6 mt-0">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <h3 className="text-lg font-semibold text-white">Servidor SMTP</h3>
                  <Button type="button" variant="outline" size="sm" onClick={testEmailConfiguration} className="border-gray-700 text-gray-300">
                    <Mail className="w-4 h-4 mr-2" /> Testar Email
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Servidor SMTP</label>
                    <Input value={formData.smtp_server || ''} onChange={(e) => handleChange('smtp_server', e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Porta SMTP</label>
                    <Input type="number" value={formData.smtp_port || ''} onChange={(e) => handleChange('smtp_port', parseInt(e.target.value))} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email do Remetente</label>
                    <Input type="email" value={formData.email_sender || ''} onChange={(e) => handleChange('email_sender', e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Nome do Remetente</label>
                    <Input value={formData.email_sender_name || ''} onChange={(e) => handleChange('email_sender_name', e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                </div>
              </TabsContent>

              {/* PAYMENT TAB */}
              <TabsContent value="payment" className="space-y-6 mt-0">
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Integração de Pagamentos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Gateway Ativo</label>
                    <select value={formData.payment_gateway || 'stripe'} onChange={(e) => handleChange('payment_gateway', e.target.value)} className="w-full bg-gray-900 border-gray-700 text-white rounded-md h-10 px-3">
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="easypay">Easypay</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Moeda</label>
                    <select value={formData.currency || 'EUR'} onChange={(e) => handleChange('currency', e.target.value)} className="w-full bg-gray-900 border-gray-700 text-white rounded-md h-10 px-3">
                      <option value="EUR">Euro (€)</option>
                      <option value="USD">Dólar ($)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Stripe Public Key</label>
                    <Input type="password" value={formData.api_keys?.stripe_public || ''} onChange={(e) => handleApiKeyChange('stripe_public', e.target.value)} className="bg-gray-900 border-gray-700 text-white" placeholder="pk_test_..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Stripe Secret Key</label>
                    <Input type="password" value={formData.api_keys?.stripe_secret || ''} onChange={(e) => handleApiKeyChange('stripe_secret', e.target.value)} className="bg-gray-900 border-gray-700 text-white" placeholder="sk_test_..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Taxa de Transação (%)</label>
                    <Input type="number" step="0.1" value={formData.transaction_fee || 0} onChange={(e) => handleChange('transaction_fee', parseFloat(e.target.value))} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                </div>
              </TabsContent>

              {/* SOCIAL TAB */}
              <TabsContent value="social" className="space-y-6 mt-0">
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Redes Sociais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok', 'whatsapp', 'telegram'].map((platform) => (
                    <SocialMediaInput 
                      key={platform} 
                      platform={platform} 
                      value={formData[`${platform}_url`] || formData[`${platform}_link`] || formData[`${platform}_number`] || ''} 
                      onChange={(val) => {
                        const key = platform === 'whatsapp' ? 'whatsapp_number' : platform === 'telegram' ? 'telegram_link' : `${platform}_url`;
                        handleChange(key, val);
                      }} 
                    />
                  ))}
                </div>
              </TabsContent>

              {/* CONTACT TAB */}
              <TabsContent value="contact" className="space-y-6 mt-0">
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Informações da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Nome da Empresa</label>
                    <Input value={formData.business_name || ''} onChange={(e) => handleChange('business_name', e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email de Contacto</label>
                    <Input type="email" value={formData.contact_email || ''} onChange={(e) => handleChange('contact_email', e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Telefone</label>
                    <Input value={formData.contact_phone || ''} onChange={(e) => handleChange('contact_phone', e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Morada</label>
                    <Input value={formData.address || ''} onChange={(e) => handleChange('address', e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Cidade</label>
                    <Input value={formData.city || ''} onChange={(e) => handleChange('city', e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">País</label>
                    <Input value={formData.country || ''} onChange={(e) => handleChange('country', e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                </div>
              </TabsContent>

              {/* GENERAL TAB */}
              <TabsContent value="general" className="space-y-6 mt-0">
                <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Configurações Globais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Nome do Site</label>
                    <Input value={formData.site_name || ''} onChange={(e) => handleChange('site_name', e.target.value)} className="bg-gray-900 border-gray-700 text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">URL do Site</label>
                    <Input value={formData.site_url || ''} onChange={(e) => handleChange('site_url', e.target.value)} className="bg-gray-900 border-gray-700 text-white" placeholder="https://barbeiros.pt" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-300">Descrição do Site (SEO)</label>
                    <Textarea value={formData.site_description || ''} onChange={(e) => handleChange('site_description', e.target.value)} className="bg-gray-900 border-gray-700 text-white" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Fuso Horário</label>
                    <select value={formData.timezone || 'Europe/Lisbon'} onChange={(e) => handleChange('timezone', e.target.value)} className="w-full bg-gray-900 border-gray-700 text-white rounded-md h-10 px-3">
                      <option value="Europe/Lisbon">Europa/Lisboa</option>
                      <option value="America/Sao_Paulo">América/São Paulo</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Formato de Data</label>
                    <select value={formData.date_format || 'DD/MM/YYYY'} onChange={(e) => handleChange('date_format', e.target.value)} className="w-full bg-gray-900 border-gray-700 text-white rounded-md h-10 px-3">
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </TabsContent>

            </SettingsForm>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
