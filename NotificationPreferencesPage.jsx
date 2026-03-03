import React, { useEffect, useState } from 'react';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Mail, Clock, Star, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Toggle = ({ checked, onCheckedChange, id }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    id={id}
    onClick={() => onCheckedChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
      ${checked ? 'bg-primary' : 'bg-slate-200'}
    `}
  >
    <span
      className={`
        pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out
        ${checked ? 'translate-x-5' : 'translate-x-0'}
      `}
    />
  </button>
);

export const NotificationPreferencesPage = () => {
  const { preferences, loading, updatePreferences } = useNotificationPreferences();
  const [localPrefs, setLocalPrefs] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (preferences) {
      setLocalPrefs(preferences);
    }
  }, [preferences]);

  const handleToggle = (key) => {
    setLocalPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePreferences(localPrefs);
    } finally {
      setIsSaving(false);
    }
  };

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      toast({ title: "Não Suportado", description: "Este navegador não suporta notificações push.", variant: "destructive" });
      return;
    }
    
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
       toast({ title: "Permissão Concedida", description: "Agora receberá notificações push." });
       handleToggle('push_notifications_enabled');
    } else {
       toast({ title: "Permissão Negada", description: "Precisa habilitar notificações nas configurações do navegador.", variant: "destructive" });
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8" /></div>;

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Preferências de Notificação</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Canais de Comunicação</CardTitle>
          <CardDescription>Escolha como deseja ser contactado.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium">Notificações Push</p>
                <p className="text-sm text-slate-500">Receber alertas no navegador/telemóvel</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
               {(!localPrefs.push_notifications_enabled && Notification.permission !== 'granted') && (
                  <Button variant="ghost" size="sm" onClick={requestPushPermission} className="text-xs h-8">Ativar no Browser</Button>
               )}
               <Toggle 
                  id="push"
                  checked={localPrefs.push_notifications_enabled} 
                  onCheckedChange={() => handleToggle('push_notifications_enabled')} 
               />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-slate-500">Receber resumos e confirmações por email</p>
              </div>
            </div>
            <Toggle 
              id="email"
              checked={localPrefs.email_notifications_enabled} 
              onCheckedChange={() => handleToggle('email_notifications_enabled')} 
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tipos de Notificação</CardTitle>
          <CardDescription>Personalize quais eventos geram alertas.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium">Lembretes de Agendamento</p>
                <p className="text-sm text-slate-500">Alertas 24h antes do serviço</p>
              </div>
            </div>
            <Toggle 
              id="reminder"
              checked={localPrefs.reminder_24h_enabled} 
              onCheckedChange={() => handleToggle('reminder_24h_enabled')} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium">Novas Avaliações</p>
                <p className="text-sm text-slate-500">Quando um cliente deixa feedback</p>
              </div>
            </div>
            <Toggle 
              id="review"
              checked={localPrefs.review_notifications_enabled} 
              onCheckedChange={() => handleToggle('review_notifications_enabled')} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-slate-500" />
              <div>
                <p className="font-medium">Subscrição e Faturação</p>
                <p className="text-sm text-slate-500">Renovações, recibos e alertas de pagamento</p>
              </div>
            </div>
            <Toggle 
              id="sub"
              checked={localPrefs.subscription_notifications_enabled} 
              onCheckedChange={() => handleToggle('subscription_notifications_enabled')} 
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> A guardar...</> : 'Guardar Alterações'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};