import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PaginationControls({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  pageSize, 
  onPageSizeChange,
  totalItems
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-gray-800 mt-6">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Mostrar</span>
        <Select value={pageSize.toString()} onValueChange={(val) => onPageSizeChange(Number(val))}>
          <SelectTrigger className="w-[80px] h-8 bg-gray-900 border-gray-700 text-white">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 text-white">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <span>por página</span>
        {totalItems > 0 && (
          <span className="ml-4">Total: {totalItems}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 hover:text-[#FFD700]"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Anterior</span>
        </Button>
        
        <span className="text-sm text-gray-400 px-2">
          Página {currentPage} de {Math.max(1, totalPages)}
        </span>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="bg-gray-900 border-gray-700 text-white hover:bg-gray-800 hover:text-[#FFD700]"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Próxima</span>
        </Button>
      </div>
    </div>
  );
}