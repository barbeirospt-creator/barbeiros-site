import React from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SearchAndFilterBar({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
  cityFilter,
  onCityFilterChange
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Pesquisar por nome..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-black border-gray-700 text-white focus:border-[#FFD700]"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-[200px]">
          <Select value={roleFilter} onValueChange={onRoleFilterChange}>
            <SelectTrigger className="bg-black border-gray-700 text-white focus:ring-[#FFD700]">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Especialidade" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="all">Todas as Especialidades</SelectItem>
              <SelectItem value="Barbeiro">Barbeiro</SelectItem>
              <SelectItem value="Cabeleireiro">Cabeleireiro</SelectItem>
              <SelectItem value="Estilista">Estilista</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-full sm:w-[200px]">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Input
              type="text"
              placeholder="Localidade..."
              value={cityFilter}
              onChange={(e) => onCityFilterChange(e.target.value)}
              className="pl-10 bg-black border-gray-700 text-white focus:border-[#FFD700]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}