
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Save, RotateCcw } from 'lucide-react';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';

export default function SettingsForm({ onSubmit, onReset, children, isLoading }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleResetClick = (e) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      {children}
      
      <div className="flex items-center justify-between pt-6 border-t border-gray-800">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleResetClick}
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
          disabled={isLoading}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Restaurar Padrões
        </Button>
        
        <Button 
          type="submit" 
          className="bg-[#FFD700] hover:bg-[#FFA500] text-black font-semibold min-w-[120px]"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Guardar Alterações
        </Button>
      </div>

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          if (onReset) onReset();
        }}
        title="Restaurar Padrões"
        message="Tem a certeza que deseja restaurar as configurações padrão? Esta ação não pode ser desfeita."
      />
    </form>
  );
}
