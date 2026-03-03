
import React from 'react';
import { Star, MapPin, Phone, Globe, Store, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GoogleBusinessSection({ data }) {
  if (!data || !data.google_business_link) return null;

  const {
    google_business_name,
    google_business_location,
    google_business_rating,
    google_business_reviews_count,
    google_business_photo,
    google_business_description,
    google_business_phone,
    google_business_website,
    google_business_link
  } = data;

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden mt-8 shadow-lg">
      {/* Header Image */}
      <div className="h-48 w-full bg-gray-800 relative border-b border-gray-800">
        {google_business_photo ? (
          <img 
            src={google_business_photo} 
            alt={google_business_name || 'Negócio'} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store className="w-16 h-16 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <h3 className="text-xl sm:text-2xl font-bold text-white shadow-sm">
            {google_business_name}
          </h3>
          {google_business_rating && (
            <div className="bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-gray-700">
              <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
              <span className="font-bold text-white">{google_business_rating}</span>
              {google_business_reviews_count && (
                <span className="text-xs text-gray-400 ml-1">({google_business_reviews_count})</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 space-y-5">
        {google_business_description && (
          <p className="text-gray-300 text-sm leading-relaxed">
            {google_business_description}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {google_business_location && (
            <div className="flex items-start gap-3 text-gray-300">
              <div className="mt-0.5 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Localização</p>
                <p className="text-sm">{google_business_location}</p>
              </div>
            </div>
          )}

          {google_business_phone && (
            <div className="flex items-start gap-3 text-gray-300">
              <div className="mt-0.5 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Telefone</p>
                <a href={`tel:${google_business_phone}`} className="text-sm hover:text-white transition-colors">
                  {google_business_phone}
                </a>
              </div>
            </div>
          )}

          {google_business_website && (
            <div className="flex items-start gap-3 text-gray-300 sm:col-span-2">
              <div className="mt-0.5 w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-gray-400" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-gray-500 font-medium uppercase mb-0.5">Website</p>
                <a 
                  href={google_business_website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm hover:text-blue-400 transition-colors truncate block"
                >
                  {google_business_website}
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2">
          <Button asChild variant="outline" className="w-full bg-white text-black hover:bg-gray-100 border-0 font-semibold">
            <a href={google_business_link} target="_blank" rel="noopener noreferrer">
              Ver no Google Meu Negócio
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
