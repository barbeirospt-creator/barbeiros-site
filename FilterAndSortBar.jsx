
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';

export default function FilterAndSortBar({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  sortOption, 
  setSortOption,
  onReset
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-gray-900 p-4 rounded-xl border border-gray-800">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input 
          placeholder="Pesquisar produto..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-black border-gray-700 text-white focus:border-[#FFD700]"
        />
      </div>
      
      <div className="flex gap-4 md:w-auto w-full">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-black border-gray-700 text-white">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-800 text-white">
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Ativa">Ativas</SelectItem>
            <SelectItem value="Fechada">Fechadas</SelectItem>
            <SelectItem value="Expirada">Expiradas</SelectItem>
            <SelectItem value="Rascunho">Rascunho</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[200px] bg-black border-gray-700 text-white">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-800 text-white">
            <SelectItem value="prazo_asc">Prazo mais próximo</SelectItem>
            <SelectItem value="preco_asc">Preço (baixo-alto)</SelectItem>
            <SelectItem value="preco_desc">Preço (alto-baixo)</SelectItem>
            <SelectItem value="participantes_desc">Participantes</SelectItem>
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          onClick={onReset}
          className="border-gray-700 text-gray-300 hover:bg-gray-800 px-3"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
