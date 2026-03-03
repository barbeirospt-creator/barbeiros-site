import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Plus, Trash2, Edit } from 'lucide-react';
import { BarberShopGallery } from '@/components/BarberShopGallery';
import { ServiceForm } from '@/components/ServiceForm';
import { TransactionHistory } from '@/components/TransactionHistory';
import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { barbershopService } from '@/services/barbershopService';
import { serviceService } from '@/services/serviceService';
import { reviewService } from '@/services/reviewService';
import { imageService } from '@/services/imageService';
import { paymentService } from '@/services/paymentService';
import { useNavigate } from 'react-router-dom';

export const BarberShopDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [transactions, setTransactions] = useState([]);
  
  // Dialog state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);

  const fetchData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data: shop } = await barbershopService.getBarbershopByUserId(user.id);
      
      if (shop) {
        setShopData(shop);
        const [srvs, revs, imgs, trans] = await Promise.all([
          serviceService.getServicesByBarbershop(shop.id),
          reviewService.getReviewsByBarbershop(shop.id),
          imageService.getImagesByBarbershop(shop.id),
          paymentService.getBarbershopTransactions(shop.id)
        ]);
        
        if (srvs.data) setServices(srvs.data);
        if (revs.data) setReviews(revs.data);
        if (imgs.data) setGallery(imgs.data);
        if (trans) setTransactions(trans);

      } else {
        navigate('/create-barbershop');
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      toast({ title: "Erro", description: "Falha ao carregar dados.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      const { data, error } = await barbershopService.updateBarbershop(shopData.id, shopData);
      if (error) throw error;
      setShopData(prev => ({ ...prev, ...data }));
      toast({ title: "Sucesso", description: "Perfil atualizado." });
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao guardar perfil.", variant: "destructive" });
    }
  };

  const handleDeleteService = async (id) => {
    if(!confirm('Tem certeza que deseja apagar este serviço?')) return;
    try {
      await serviceService.deleteService(id);
      setServices(services.filter(s => s.id !== id));
      toast({ title: "Sucesso", description: "Serviço removido." });
    } catch(err) {
      toast({ title: "Erro", description: "Falha ao remover serviço.", variant: "destructive" });
    }
  };

  const handleOpenServiceModal = (service = null) => {
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  // Commission Calculation
  const currentMonth = new Date().getMonth();
  const monthlyCommissions = transactions
    .filter(t => new Date(t.data).getMonth() === currentMonth && t.status === 'completed')
    .reduce((acc, t) => acc + (t.comissao || 0), 0);

  // Determine current plan/commission rate
  const currentPlan = "Profissional";
  const commissionRate = currentPlan === "Premium" ? 20 : 15;

  if (loading) return <div className="p-10 text-center">A carregar dados...</div>;
  if (!shopData) return null;

  return (
    <DashboardLayout title="Gestão da Barbearia" subtitle="Configure o seu perfil público">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 flex-wrap h-auto gap-2">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="gallery">Galeria</TabsTrigger>
            <TabsTrigger value="reviews">Avaliações</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="subscription">Subscrição</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Informações Básicas</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome</label>
                  <Input value={shopData.name} onChange={e => setShopData({...shopData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Descrição</label>
                  <Input value={shopData.description} onChange={e => setShopData({...shopData, description: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Localização</label>
                  <Input value={shopData.location?.address || shopData.location} onChange={e => setShopData({...shopData, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                   <label className="text-sm font-medium">Telefone</label>
                   <Input value={shopData.contacts?.phone || ''} onChange={e => setShopData({...shopData, contacts: {...shopData.contacts, phone: e.target.value}})} />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleSaveProfile} className="gap-2"><Save className="w-4 h-4" /> Guardar</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Os Seus Serviços</h3>
                <Button onClick={() => handleOpenServiceModal(null)} size="sm" className="gap-2"><Plus className="w-4 h-4" /> Novo Serviço</Button>
              </div>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="flex items-center gap-4 p-4 border rounded-lg bg-slate-50">
                    <div className="flex-1">
                      <h4 className="font-bold">{service.name}</h4>
                      <p className="text-xs text-slate-500">{service.duration} min • {service.price}€</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenServiceModal(service)}><Edit className="w-4 h-4 text-blue-500" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                  </div>
                ))}
                {services.length === 0 && <p className="text-center text-slate-500">Nenhum serviço registado.</p>}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gallery">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-lg mb-6">Galeria</h3>
               <BarberShopGallery 
                  images={gallery} 
                  canUpload={true} 
                  barbershopId={shopData.id}
                  onImageUploaded={(newImg) => setGallery([...gallery, newImg])}
               />
             </div>
          </TabsContent>

          <TabsContent value="reviews">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-lg mb-6">Avaliações</h3>
               {reviews.length === 0 ? <p className="text-slate-500">Sem avaliações.</p> : reviews.map(r => (
                 <div key={r.id} className="border-b py-3 last:border-0">
                    <div className="flex justify-between font-medium"><span>{r.author}</span><span>{r.rating}/5</span></div>
                    <p className="text-slate-600 text-sm mt-1">{r.comment}</p>
                 </div>
               ))}
             </div>
          </TabsContent>

          <TabsContent value="transactions">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h4 className="text-sm font-medium text-slate-500">Comissões (Este Mês)</h4>
                   <p className="text-3xl font-bold text-slate-900">{monthlyCommissions.toFixed(2)}€</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h4 className="text-sm font-medium text-slate-500">Taxa de Comissão Atual</h4>
                   <p className="text-3xl font-bold text-primary">{commissionRate}%</p>
                   <p className="text-xs text-slate-400">Plano {currentPlan}</p>
                 </div>
              </div>
              <TransactionHistory />
            </div>
          </TabsContent>

          <TabsContent value="subscription">
             <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
               <h3 className="font-bold text-lg mb-2">O seu plano atual</h3>
               <div className="flex justify-between items-center">
                 <div>
                   <p className="text-2xl font-bold text-primary">{currentPlan}</p>
                   <p className="text-slate-500 text-sm">Próxima renovação: 15 Out 2024</p>
                 </div>
                 <Button variant="outline">Gerir Subscrição</Button>
               </div>
             </div>
             <SubscriptionPlans />
          </TabsContent>

        </Tabs>
      </div>

      <ServiceForm 
        open={isServiceModalOpen} 
        onClose={() => setIsServiceModalOpen(false)} 
        serviceToEdit={editingService}
        barbershopId={shopData?.id}
        onSave={fetchData}
      />
    </DashboardLayout>
  );
};