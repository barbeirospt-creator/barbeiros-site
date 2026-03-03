
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function GoogleBusinessBadge({ showText = false, className = '' }) {
  return (
    <div 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default ${className}`}
      title="Verificado com Google Meu Negócio"
    >
      <div className="flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full">
        <CheckCircle2 className="w-3 h-3 text-white" />
      </div>
      {showText && (
        <span className="text-xs font-semibold text-gray-700 tracking-tight">
          <span className="text-blue-600">G</span>
          <span className="text-red-500">o</span>
          <span className="text-yellow-500">o</span>
          <span className="text-blue-600">g</span>
          <span className="text-green-500">l</span>
          <span className="text-red-500">e</span>
          {' '}Verificado
        </span>
      )}
    </div>
  );
}
