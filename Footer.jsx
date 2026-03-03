
import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col gap-4">
            <span className="text-2xl font-bold text-[#FFD700]">Barbeiros.pt</span>
            <p className="text-gray-400 text-sm leading-relaxed">
              A plataforma premium da comunidade para barbearias portuguesas.
            </p>
          </div>
          
          {/* Column 2: Platform Links */}
          <div>
            <span className="text-[#FFD700] font-semibold mb-6 block uppercase tracking-wider text-sm">Plataforma</span>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Community Links */}
          <div>
            <span className="text-[#FFD700] font-semibold mb-6 block uppercase tracking-wider text-sm">Comunidade</span>
            <ul className="space-y-3">
              <li>
                <Link to="/community" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Feed da Comunidade
                </Link>
              </li>
              <li>
                <Link to="/compras-em-grupo" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Compras em Grupo
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Fórum
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Eventos
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Legal & Support */}
          <div>
            <span className="text-[#FFD700] font-semibold mb-6 block uppercase tracking-wider text-sm">Legal</span>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Termos de Serviço
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Suporte
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 Barbeiros.pt. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-[#FFD700] transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-[#FFD700] transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
