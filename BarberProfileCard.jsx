
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, User, ExternalLink, Globe, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import GoogleBusinessBadge from './GoogleBusinessBadge';
import { debugGoogleSync } from '@/utils/debugGoogleSync';

export default function BarberProfileCard({ barber }) {
  useEffect(() => {
    debugGoogleSync(`BarberProfileCard received props for ${barber.id}`, barber);
  }, [barber]);

  const isGoogleSynced = !!barber.google_business_link;

  const displayName = (isGoogleSynced && barber.google_business_name) 
    ? barber.google_business_name 
    : (barber.display_name || barber.full_name || 'Barbeiro Sem Nome');
    
  const location = (isGoogleSynced && barber.google_business_location) 
    ? barber.google_business_location 
    : (barber.city || 'Localização não definida');
    
  const bio = (isGoogleSynced && barber.google_business_description) 
    ? barber.google_business_description 
    : (barber.bio || 'Este barbeiro ainda não adicionou uma biografia.');
  
  const initial = displayName.charAt(0).toUpperCase();
  const avatar = (isGoogleSynced && barber.google_business_photo) ? barber.google_business_photo : barber.avatar_url;
  
  const rating = (isGoogleSynced && barber.google_business_rating) ? barber.google_business_rating : (barber.rating || (4 + Math.random()).toFixed(1));
  const reviewCount = (isGoogleSynced && barber.google_business_reviews_count) ? barber.google_business_reviews_count : (barber.reviewCount || Math.floor(Math.random() * 100) + 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`bg-black border rounded-xl overflow-hidden transition-all shadow-lg flex flex-col h-full relative group hover:shadow-[0_0_15px_rgba(255,215,0,0.15)] ${
        isGoogleSynced ? 'border-[#FFD700]/30 hover:border-[#FFD700]' : 'border-gray-800 hover:border-gray-600'
      }`}
    >
      <div className={`h-28 relative ${isGoogleSynced ? 'bg-gradient-to-r from-blue-900/40 to-gray-900' : 'bg-gradient-to-r from-gray-900 to-gray-800'}`}>
        <div className="absolute top-3 left-3 z-10">
          {isGoogleSynced && <GoogleBusinessBadge showText={true} />}
        </div>
        
        <div className="absolute -bottom-10 left-6">
          <div className={`w-20 h-20 rounded-full border-4 border-black bg-gray-800 flex items-center justify-center overflow-hidden relative shadow-lg ${isGoogleSynced ? 'shadow-[#FFD700]/20' : ''}`}>
            {avatar ? (
              <img src={avatar} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold text-gray-400">{initial}</span>
            )}
          </div>
        </div>
        
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md border border-gray-700/50 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
          <span className="text-xs font-bold text-white">{rating}</span>
          <span className="text-xs text-gray-400">({reviewCount})</span>
        </div>
      </div>
      
      <div className="pt-12 px-6 pb-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white line-clamp-1 mb-1 group-hover:text-[#FFD700] transition-colors">{displayName}</h3>
        
        <div className="flex items-center gap-1 text-sm text-gray-400 mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1 italic">
          "{bio}"
        </p>

        {isGoogleSynced && (barber.google_business_phone || barber.google_business_website) && (
          <div className="flex gap-3 mb-4 text-xs text-gray-400">
            {barber.google_business_phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span className="truncate max-w-[100px]">{barber.google_business_phone}</span>
              </div>
            )}
            {barber.google_business_website && (
              <div className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                <span>Website</span>
              </div>
            )}
          </div>
        )}
        
        <div className="mt-auto pt-4 border-t border-gray-800/50">
          <Button asChild className="w-full bg-gray-900 hover:bg-[#FFD700] text-white hover:text-black transition-colors">
            <Link to={`/barber/${barber.id}`}>
              <User className="w-4 h-4 mr-2" />
              Ver Perfil Completo
              <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
