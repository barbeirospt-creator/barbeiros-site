import React from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Tag, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BarberShopCard = ({ barbershop }) => {
  return (
    <Link to={`/barbershops/${barbershop.id}`}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full border border-slate-100 flex flex-col group"
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={barbershop.logo}
            alt={barbershop.name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
          {barbershop.isPremium && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <ShieldCheck className="w-3 h-3" />
              PREMIUM
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-900 shadow-sm">
            {barbershop.priceRange}
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{barbershop.name}</h3>
            <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold text-slate-700">{barbershop.rating}</span>
              <span className="text-xs text-slate-400">({barbershop.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{barbershop.location.city}, {barbershop.location.district}</span>
          </div>

          <div className="mt-auto">
            <div className="flex flex-wrap gap-2 mb-3">
              {barbershop.services.slice(0, 2).map((service, idx) => (
                <span key={idx} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                  {service.name}
                </span>
              ))}
              {barbershop.services.length > 2 && (
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                  +{barbershop.services.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};