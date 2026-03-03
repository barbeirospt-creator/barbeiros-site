
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import BarberProfileCard from '@/components/community/BarberProfileCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Loader2, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommunityBarbers } from '@/hooks/useCommunityBarbers';

export default function ComunidadeBarberPage() {
  const { toast } = useToast();
  const {
    profiles: barbers,
    loading,
    searchTerm,
    setSearchTerm,
    cityFilter,
    setCityFilter,
    roleFilter,
    setRoleFilter
  } = useCommunityBarbers();
  
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    if (barbers.length > 0) {
      const cities = [...new Set(barbers.map(b => b.googleData?.google_business_location || b.city).filter(Boolean))].sort();
      setAvailableCities(cities);
    }
  }, [barbers]);

  const filteredAndSortedBarbers = useMemo(() => {
    let result = [...barbers];

    // Rating Filter
    if (ratingFilter !== 'all') {
      if (ratingFilter === '4plus') {
        result = result.filter(b => (b.googleData?.google_business_rating || b.rating || 0) >= 4.0);
      }
      if (ratingFilter === '3plus') {
        result = result.filter(b => (b.googleData?.google_business_rating || b.rating || 0) >= 3.0);
      }
    }

    // Sorting
    result.sort((a, b) => {
      const nameA = a.googleData?.google_business_name || a.display_name || a.full_name || '';
      const nameB = b.googleData?.google_business_name || b.display_name || b.full_name || '';
      const ratingA = a.googleData?.google_business_rating || a.rating || 0;
      const ratingB = b.googleData?.google_business_rating || b.rating || 0;

      if (sortBy === 'name') {
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'rating') {
        return ratingB - ratingA;
      }
      if (sortBy === 'newest') {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
      return 0;
    });

    return result;
  }, [barbers, ratingFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setRatingFilter('all');
    setSortBy('newest');
  };

  const activeFiltersCount = (cityFilter ? 1 : 0) + (ratingFilter !== 'all' ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24">
      <Helmet>
        <title>Comunidade de Barbeiros | Barbeiros PT</title>
        <meta name="description" content="Encontre e conecte-se com os melhores barbeiros de Portugal." />
      </Helmet>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mb-2">
          <Users className="text-[#FFD700] h-8 w-8" />
          <span>Comunidade de <span className="text-[#FFD700]">Barbeiros</span></span>
        </h1>
        <p className="text-gray-400">Descubra profissionais, inspire-se e expanda a sua rede de contactos.</p>
      </div>

      {/* Filters & Search Section */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 mb-8 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row gap-4">
          
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input 
              placeholder="Pesquisar por nome ou cidade..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black border-gray-700 text-white focus:border-[#FFD700]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap md:flex-nowrap gap-3">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-black border border-gray-700 text-white text-sm rounded-md px-3 py-2 focus:border-[#FFD700] outline-none min-w-[140px]"
            >
              <option value="">Todas as Cidades</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-black border border-gray-700 text-white text-sm rounded-md px-3 py-2 focus:border-[#FFD700] outline-none min-w-[140px]"
            >
              <option value="all">Todas as Avaliações</option>
              <option value="4plus">4.0+ Estrelas</option>
              <option value="3plus">3.0+ Estrelas</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black border border-gray-700 text-white text-sm rounded-md px-3 py-2 focus:border-[#FFD700] outline-none min-w-[160px]"
            >
              <option value="newest">Mais Recentes</option>
              <option value="rating">Melhor Avaliação</option>
              <option value="name">Nome (A-Z)</option>
            </select>

            {(activeFiltersCount > 0 || searchTerm || sortBy !== 'newest') && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="text-gray-400 hover:text-white hover:bg-gray-800 px-3"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center text-sm text-gray-500">
          <span>A mostrar {filteredAndSortedBarbers.length} profissionais</span>
          {activeFiltersCount > 0 && <span>{activeFiltersCount} filtro(s) ativo(s)</span>}
        </div>
      </div>

      {/* Grid Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#FFD700] animate-spin mb-4" />
          <p className="text-gray-400">A procurar barbeiros na comunidade...</p>
        </div>
      ) : filteredAndSortedBarbers.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/30 rounded-xl border border-gray-800">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Nenhum barbeiro encontrado</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Não encontrámos resultados para a sua pesquisa com os filtros atuais. Tente ajustar os critérios.
          </p>
          <Button onClick={clearFilters} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
            Limpar Todos os Filtros
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredAndSortedBarbers.map((barber) => (
              <BarberProfileCard key={barber.id} barber={barber} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
