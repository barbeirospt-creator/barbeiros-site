import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function NavbarPublic() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gradient-gold">Barbeiros.pt</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-[#FFD700] transition-colors duration-200"
            >
              Home
            </Link>
            <Link 
              to="/faq" 
              className="text-gray-300 hover:text-[#FFD700] transition-colors duration-200"
            >
              FAQ
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
                Register
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-[#FFD700] transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-t border-gray-800"
          >
            <div className="px-4 py-6 space-y-4">
              <Link 
                to="/" 
                className="block text-gray-300 hover:text-[#FFD700] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/faq" 
                className="block text-gray-300 hover:text-[#FFD700] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black">
                  Login
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#FFD700] text-black hover:bg-[#FFA500]">
                  Register
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}