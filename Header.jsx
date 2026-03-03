
import React from "react";
import { Bell, User, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

export default function Header() {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: "Ação não disponível",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  return (
    <header className="h-16 bg-black border-b border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4 md:hidden">
        <button onClick={handleAction} className="text-zinc-400 hover:text-[#FFD700] transition-colors">
          <Menu size={24} />
        </button>
        <span className="text-xl font-bold text-[#FFD700]">Barbeiros.pt</span>
      </div>

      <div className="hidden md:flex flex-1">
        {/* Search or breadcrumbs could go here */}
      </div>

      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAction} 
          className="relative p-2 text-zinc-400 hover:text-[#FFD700] transition-colors"
        >
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFD700] rounded-full border border-black"></span>
        </motion.button>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAction} 
          className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full hover:border-[#FFD700] transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[#FFD700]">
            <User size={16} />
          </div>
          <span className="text-sm font-medium text-white hidden sm:block">Meu Perfil</span>
        </motion.button>
      </div>
    </header>
  );
}
