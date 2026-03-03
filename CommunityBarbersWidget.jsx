import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronLeft, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunityBarbersWidget({ collapsed }) {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBarbers();

    const channel = supabase
      .channel('public:profiles_shared_widget')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'profiles',
        filter: 'is_shared=eq.true'
      }, payload => {
        fetchBarbers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchBarbers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_shared', true)
        .order('updated_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setBarbers(data || []);
    } catch (error) {
      console.error('Error fetching shared barbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = async (barberId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('analytics_events').insert([{
          user_id: user.id,
          event_type: 'profile_view',
          event_data: { viewed_profile_id: barberId }
        }]);
      }
    } catch (err) {
      console.error('Error logging profile view:', err);
    }
    
    navigate(`/app/community?profile=${barberId}`);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -150 : 150;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (collapsed) return null;

  return (
    <div className="py-4 px-2 border-t border-gray-800 flex flex-col max-h-[300px]">
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2 text-gray-400">
          <Users size={16} className="text-[#FFD700]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">Barbeiros na Comunidade</h3>
        </div>
        {!loading && barbers.length > 0 && (
          <div className="flex gap-1">
            <button onClick={() => scroll('left')} className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => scroll('right')} className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div className="relative flex-1 min-h-[100px] mb-2">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#FFD700] animate-spin" />
          </div>
        ) : barbers.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 text-center px-4">
            Nenhum barbeiro partilhado.
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-2 px-2 snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`
              .flex.overflow-x-auto::-webkit-scrollbar {
                  display: none;
              }
            `}</style>
            
            {barbers.map((barber) => (
              <motion.div
                key={barber.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleProfileClick(barber.id)}
                className="snap-start flex-shrink-0 w-24 mr-4 cursor-pointer group flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-[#FFD700] transition-colors mb-2 bg-gray-800 flex items-center justify-center shadow-lg group-hover:shadow-[#FFD700]/20">
                  {barber.avatar_url ? (
                    <img src={barber.avatar_url} alt={barber.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-gray-400 group-hover:text-[#FFD700] transition-colors">
                      {(barber.display_name || barber.full_name || 'B').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white text-center font-medium truncate w-full px-1">
                  {barber.display_name || barber.full_name || 'Anónimo'}
                </p>
                <p className="text-[10px] text-gray-500 text-center truncate w-full px-1">
                  {barber.role || 'Barbeiro'}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {!loading && barbers.length > 0 && (
        <button
          onClick={() => navigate('/app/community-barbers')}
          className="mx-2 mt-2 py-2 px-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-800 text-xs text-gray-300 hover:text-[#FFD700] transition-all flex items-center justify-center gap-2 group"
        >
          Ver Todos
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
}