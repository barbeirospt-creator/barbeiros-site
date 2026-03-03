
import React from "react";
import { Helmet } from "react-helmet";
import PublicLayout from "@/components/layouts/PublicLayout";

export default function TermsOfServicePage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Termos de Serviço - Barbeiros.pt</title>
        <meta name="description" content="Termos de serviço do Barbeiros.pt." />
      </Helmet>
      <div className="min-h-screen py-20 bg-black flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Termos de <span className="text-[#FFD700]">Serviço</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Consulte os termos e condições que regem a utilização da plataforma Barbeiros.pt.
        </p>
      </div>
    </PublicLayout>
  );
}
