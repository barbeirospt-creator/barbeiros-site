import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWA } from '@/hooks/usePWA';

export const PWAInstallPrompt = () => {
  const { isInstallable, handleInstall } = usePWA();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-20 left-4 right-4 md:bottom-4 md:left-auto md:right-4 md:w-96 bg-white border border-slate-200 shadow-lg rounded-xl p-4 z-50 flex items-center gap-4"
      >
        <div className="bg-slate-900 p-2 rounded-lg">
          <Download className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-sm text-slate-900">Instalar Barbeiros.pt</h3>
          <p className="text-xs text-slate-500">Aceda à app diretamente do seu ecrã inicial</p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            onClick={handleInstall}
            className="h-8 text-xs font-medium"
          >
            Instalar
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setDismissed(true)}
            className="h-8 w-8 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};