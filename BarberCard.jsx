import React from 'react';
import { MapPin, Star, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function BarberCard({ profile }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/app/community?profile=${profile.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] transition-all duration-300 flex flex-col h-full"
    >
      <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-900 relative">
        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-20 h-20 rounded-full border-4 border-black overflow-hidden bg-gray-800 flex items-center justify-center shadow-lg">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name || 'Barbeiro'} className="w-full h-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-gray-500" />
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-12 pb-6 px-4 flex-1 flex flex-col items-center text-center">
        <h3 className="text-lg font-bold text-white mb-1 truncate w-full">
          {profile.display_name || profile.full_name || 'Anónimo'}
        </h3>
        
        <p className="text-sm text-[#FFD700] mb-3 font-medium">
          {profile.role || 'Barbeiro'}
        </p>
        
        {profile.city && (
          <div className="flex items-center text-xs text-gray-400 mb-3">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="truncate">{profile.city}{profile.country ? `, ${profile.country}` : ''}</span>
          </div>
        )}
        
        <p className="text-xs text-gray-400 line-clamp-2 mt-auto">
          {profile.bio || 'Sem biografia disponível.'}
        </p>

        <div className="flex items-center gap-1 mt-4 text-[#FFD700]">
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 text-gray-600" />
          <span className="text-xs text-gray-400 ml-1">(4.0)</span>
        </div>
      </div>
    </motion.div>
  );
}