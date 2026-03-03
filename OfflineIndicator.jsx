import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const OfflineIndicator = () => {
  const { isOnline } = usePWA();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-amber-500 text-white text-xs font-medium text-center overflow-hidden z-[60]"
        >
          <div className="py-2 px-4 flex items-center justify-center gap-2">
            <WifiOff className="w-3 h-3" />
            <span>Modo offline - Funcionalidades limitadas</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};