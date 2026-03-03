
import React from "react";
import { Helmet } from "react-helmet";
import PublicLayout from "@/components/layouts/PublicLayout";

export default function SupportPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Suporte - Barbeiros.pt</title>
        <meta name="description" content="Centro de suporte do Barbeiros.pt." />
      </Helmet>
      <div className="min-h-screen py-20 bg-black flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Centro de <span className="text-[#FFD700]">Suporte</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Estamos aqui para ajudar. Aceda a guias, tutoriais ou contacte a nossa equipa técnica.
        </p>
      </div>
    </PublicLayout>
  );
}
