
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminTable({ columns, data, loading, onEdit, onDelete, onView }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-900 border border-gray-800 rounded-xl">
        <p className="text-gray-400">Nenhum registo encontrado.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-400 uppercase bg-black/50 border-b border-gray-800">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 font-medium">{col.header}</th>
            ))}
            <th className="px-6 py-4 font-medium text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {data.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-gray-800/50 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-6 py-4 text-gray-300">
                  {col.render ? col.render(item) : item[col.accessor]}
                </td>
              ))}
              <td className="px-6 py-4 text-right space-x-2">
                {onView && (
                  <Button variant="ghost" size="sm" onClick={() => onView(item)} className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                    Ver
                  </Button>
                )}
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(item)} className="text-[#FFD700] hover:text-[#FFA500] hover:bg-[#FFD700]/10">
                    Editar
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="sm" onClick={() => onDelete(item)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                    Eliminar
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
