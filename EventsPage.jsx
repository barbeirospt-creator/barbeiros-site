
import React from "react";
import { Helmet } from "react-helmet";
import PublicLayout from "@/components/layouts/PublicLayout";

export default function EventsPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Eventos - Barbeiros.pt</title>
        <meta name="description" content="Eventos e workshops para a comunidade de barbeiros em Portugal." />
      </Helmet>
      <div className="min-h-screen py-20 bg-black flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          <span className="text-[#FFD700]">Eventos</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl">
          Descubra os próximos eventos, workshops e encontros da comunidade de barbeiros.
        </p>
      </div>
    </PublicLayout>
  );
}
