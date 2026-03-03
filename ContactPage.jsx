
import React from "react";
import { Helmet } from "react-helmet";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";
import ContactFormComponent from "@/components/ContactFormComponent";
import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Contacto - Barbeiros.pt</title>
        <meta name="description" content="Entre em contacto com a equipa do Barbeiros.pt. Estamos aqui para ajudar a sua barbearia." />
      </Helmet>
      
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Contacte-<span className="text-[#FCD34D]">nos</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Tem dúvidas ou precisa de ajuda? A nossa equipa está aqui para apoiar a sua barbearia. Contacte-nos através do formulário abaixo.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ContactFormComponent />
            </div>

            <div className="space-y-8">
              <div className="bg-zinc-900/50 p-8 rounded-xl border border-zinc-800 h-full">
                <h3 className="text-2xl font-bold text-white mb-8 border-b border-zinc-800 pb-4">
                  Informações de Contacto
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#FCD34D]/10 p-3 rounded-lg mt-1">
                      <Mail className="w-6 h-6 text-[#FCD34D]" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Email</h4>
                      <p className="text-gray-400">info@barbeiros.pt</p>
                      <p className="text-gray-500 text-sm mt-1">Tempo de resposta: ~24h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#FCD34D]/10 p-3 rounded-lg mt-1">
                      <Phone className="w-6 h-6 text-[#FCD34D]" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Telefone</h4>
                      <p className="text-gray-400">+351 912 345 678</p>
                      <p className="text-gray-500 text-sm mt-1">Seg - Sex, 9h às 18h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-[#FCD34D]/10 p-3 rounded-lg mt-1">
                      <MapPin className="w-6 h-6 text-[#FCD34D]" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Sede</h4>
                      <p className="text-gray-400">Av. da Liberdade, 110</p>
                      <p className="text-gray-400">1250-146 Lisboa, Portugal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#FCD34D]/10 p-3 rounded-lg mt-1">
                      <Clock className="w-6 h-6 text-[#FCD34D]" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">Horário de Suporte</h4>
                      <p className="text-gray-400">Segunda a Sexta: 09:00 - 18:00</p>
                      <p className="text-gray-400">Fins de semana: Fechado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
