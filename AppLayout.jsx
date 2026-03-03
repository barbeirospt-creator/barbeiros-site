
import React from "react";
import SidebarApp from "@/components/SidebarApp";
import { motion } from "framer-motion";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-black dark">
      <SidebarApp />
      
      <main className="flex-1 w-full md:w-auto overflow-x-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full px-4 sm:px-6 lg:px-8 py-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
