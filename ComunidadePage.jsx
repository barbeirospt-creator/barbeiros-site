
import React, { useState, useMemo, useEffect } from 'react';
import { Users, Search, X, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';
import { useComunidadeBarbers } from '@/hooks/useComunidadeBarbers';
import BarberProfileCard from '@/components/community/BarberProfileCard';
import { motion, AnimatePresence } from 'framer-motion';
import { debugGoogleSync } from '@/utils/debugGoogleSync';

export default function ComunidadePage() {
  const { toast } = useToast();
  const { barbers, loading, error, refetch } = useComunidadeBarbers();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (barbers.length > 0) {
      debugGoogleSync('ComunidadePage passing barbers to BarberProfileCard', barbers);
    }
  }, [barbers]);

  const filteredBarbers = useMemo(() => {
    if (!searchQuery.trim()) return barbers;
    
    const query = searchQuery.toLowerCase();
    return barbers.filter(barber => {
      const name = barber.display_name || barber.full_name || barber.google_business_name || '';
      const location = (barber.city || '') + (barber.google_business_location || '');
      
      return name.toLowerCase().includes(query) || location.toLowerCase().includes(query);
    });
  }, [barbers, searchQuery]);

  const handleAction = () => {
    toast({
      title: "Ação não disponível",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24">
      <Helmet>
        <title>Comunidade | Barbeiros PT</title>
        <meta name="description" content="Conecte-se com a comunidade de barbeiros de Portugal." />
      </Helmet>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <Users className="text-[#FFD700] h-8 w-8" />
            <span>Membros da <span className="text-[#FFD700]">Comunidade</span></span>
          </h1>
          <p className="text-gray-400">Descubra e conecte-se com os melhores barbeiros da plataforma.</p>
        </div>
        <Button onClick={handleAction} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
          Convidar Colegas
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 mb-8 backdrop-blur-sm">
        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          <Input 
            placeholder="Pesquisar por nome ou cidade..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black border-gray-700 text-white focus:border-[#FFD700]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content States: Loading, Error, Empty, or Data */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl h-[340px] animate-pulse">
              <div className="h-24 bg-gray-800 rounded-t-xl"></div>
              <div className="px-6 pb-6 pt-12 relative">
                <div className="absolute -top-10 left-6 w-20 h-20 bg-gray-700 rounded-full border-4 border-gray-900"></div>
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2 mb-6"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-800 rounded w-full"></div>
                  <div className="h-3 bg-gray-800 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Erro ao carregar comunidade</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button onClick={refetch} variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      ) : filteredBarbers.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/30 rounded-xl border border-gray-800">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            {searchQuery ? "Nenhum barbeiro encontrado" : "A comunidade está vazia"}
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            {searchQuery 
              ? "Não encontrámos resultados para a sua pesquisa. Tente usar outros termos." 
              : "Ainda não existem barbeiros registados com o perfil público."}
          </p>
          {searchQuery && (
            <Button onClick={() => setSearchQuery('')} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
              Limpar Pesquisa
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredBarbers.map((barber) => (
              <BarberProfileCard key={barber.id} barber={barber} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
