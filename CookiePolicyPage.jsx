
import React from "react";
import { Helmet } from "react-helmet";
import PublicLayout from "@/components/layouts/PublicLayout";

export default function CookiePolicyPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Política de Cookies - Barbeiros.pt</title>
        <meta name="description" content="Política de cookies do Barbeiros.pt." />
      </Helmet>
      <div className="min-h-screen py-20 bg-black flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Política de <span className="text-[#FFD700]">Cookies</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Informações sobre como utilizamos cookies para melhorar a sua experiência.
        </p>
      </div>
    </PublicLayout>
  );
}
