
import React from "react";
import { Helmet } from "react-helmet";
import PublicLayout from "@/components/layouts/PublicLayout";

export default function AboutPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Sobre Nós - Barbeiros.pt</title>
        <meta name="description" content="Saiba mais sobre o Barbeiros.pt, a plataforma premium para barbearias portuguesas." />
      </Helmet>
      <div className="min-h-screen py-20 bg-black flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Sobre <span className="text-[#FFD700]">Nós</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          O Barbeiros.pt é a principal plataforma dedicada a elevar as barbearias em Portugal através de comunidade, ferramentas e colaboração.
        </p>
      </div>
    </PublicLayout>
  );
}
