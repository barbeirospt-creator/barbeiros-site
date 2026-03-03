
import React, { useEffect } from 'react';
import GoogleBusinessIntegration from './GoogleBusinessIntegration';
import WhatsAppIntegration from './WhatsAppIntegration';
import BukAgendaIntegration from './BukAgendaIntegration';
import GoogleMeuNegocioIntegration from './GoogleMeuNegocioIntegration';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

class IntegrationsErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[IntegrationsErrorBoundary] Caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="bg-red-50/10 border-red-900/30 shadow-lg rounded-2xl mt-8">
          <CardContent className="py-8 px-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-red-400 font-bold text-lg mb-2">Algo correu mal</h3>
            <p className="text-red-400/80 mb-4">{this.state.error?.message || 'Ocorreu um erro ao carregar o painel de integrações.'}</p>
            <button 
              className="px-4 py-2 bg-red-900/40 text-red-300 rounded hover:bg-red-900/60 transition"
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Tentar Novamente
            </button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default function IntegrationsSection({
  integrations,
  loading,
  onConnect,
  disconnectGoogleBusiness,
  disconnectWhatsApp,
  disconnectBukAgenda,
  disconnectGoogleBusinessLink
}) {
  
  useEffect(() => {
    console.log('[IntegrationsSection] Montado. Validando onConnect prop:', typeof onConnect);
  }, [onConnect]);

  const isConnectValid = typeof onConnect === 'function';

  if (!isConnectValid) {
    console.error('[IntegrationsSection] Erro: onConnect prop não é uma função! As integrações não poderão ser salvas.');
  }

  return (
    <IntegrationsErrorBoundary>
      <Card className="bg-[#0A0A0A] border-gray-800 shadow-lg rounded-2xl overflow-hidden mt-8 hover:border-gray-700 transition-all duration-500">
        <CardHeader className="border-b border-gray-800 bg-gray-900/40">
          <CardTitle className="text-white flex justify-between items-center">
            <span className="text-xl font-bold">Integrações de Negócio</span>
          </CardTitle>
          <p className="text-gray-400 text-sm mt-1">Conecte serviços externos para sincronizar dados e facilitar a comunicação com os seus clientes.</p>
        </CardHeader>
        
        <CardContent className="py-8 px-6 space-y-6">
          {!isConnectValid && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">O sistema de integrações está temporariamente indisponível (Erro de configuração).</p>
            </div>
          )}
          
          <GoogleBusinessIntegration 
            integrations={integrations}
            onConnect={onConnect}
            onDisconnect={disconnectGoogleBusiness}
            globalLoading={loading}
          />
          <WhatsAppIntegration 
            integrations={integrations}
            onConnect={onConnect}
            onDisconnect={disconnectWhatsApp}
            globalLoading={loading}
          />
          <BukAgendaIntegration 
            integrations={integrations}
            onConnect={onConnect}
            onDisconnect={disconnectBukAgenda}
            globalLoading={loading}
          />
          <GoogleMeuNegocioIntegration 
            integrations={integrations}
            onConnect={onConnect}
            onDisconnect={disconnectGoogleBusinessLink}
            globalLoading={loading}
          />
        </CardContent>
      </Card>
    </IntegrationsErrorBoundary>
  );
}
