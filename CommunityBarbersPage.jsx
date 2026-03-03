
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import { motion } from 'framer-motion';
import { Users, AlertCircle } from 'lucide-react';
import { useCommunityBarbers } from '@/hooks/useCommunityBarbers';
import SearchAndFilterBar from '@/components/SearchAndFilterBar';
import BarberCard from '@/components/BarberCard';
import PaginationControls from '@/components/PaginationControls';

export default function CommunityBarbersPage() {
  const {
    profiles,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    roleFilter,
    setRoleFilter,
    cityFilter,
    setCityFilter,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalCount,
    totalPages
  } = useCommunityBarbers();

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Users className="text-[#FFD700] h-6 w-6 md:h-8 md:w-8" />
              Barbeiros da <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFA500]">Comunidade</span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base">Descubra e conecte-se com outros profissionais da área.</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 md:mb-8"
        >
          <SearchAndFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            cityFilter={cityFilter}
            onCityFilterChange={setCityFilter}
          />
        </motion.div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 flex items-start gap-3 mb-8">
            <AlertCircle className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-500 font-medium">Erro ao carregar barbeiros</h3>
              <p className="text-red-400/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl h-[280px] animate-pulse flex flex-col">
                  <div className="h-24 bg-gray-800 rounded-t-xl relative">
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-20 rounded-full bg-gray-700 border-4 border-gray-900"></div>
                  </div>
                  <div className="pt-14 px-4 flex flex-col items-center gap-3">
                    <div className="h-5 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-800 rounded w-2/3 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : profiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-800 rounded-xl bg-gray-900/30">
              <Users className="h-16 w-16 text-gray-600 mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">Nenhum barbeiro encontrado</h3>
              <p className="text-gray-400 max-w-md text-sm md:text-base">
                Não conseguimos encontrar nenhum barbeiro que corresponda aos seus critérios de pesquisa.
              </p>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
            >
              {profiles.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <BarberCard profile={profile} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {!loading && totalCount > 0 && (
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            totalItems={totalCount}
          />
        )}
      </div>
    </AppLayout>
  );
}
