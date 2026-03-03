import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import ShowcasePreviewCard from './ShowcasePreviewCard';
import { Store, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export default function CommunityShowcasesWidget({ collapsed }) {
  const [showcases, setShowcases] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchShowcases();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('public:business_info')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'business_info' }, payload => {
        console.log('Real-time update received:', payload);
        fetchShowcases(); // Re-fetch to get joined data easily, or update state optimistically
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchShowcases = async () => {
    try {
      setLoading(true);
      // Fetch businesses with their first photo and owner profile
      // Note: Assuming no 'published' field based on standard schema, just fetching all public ones
      const { data, error } = await supabase
        .from('business_info')
        .select(`
          *,
          business_photos(image_url),
          profiles(display_name, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setShowcases(data || []);
    } catch (error) {
      console.error('Error fetching showcases:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -200 : 200;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (collapsed) return null;

  return (
    <div className="py-4 px-2 border-t border-gray-800 flex flex-col max-h-[300px]">
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2 text-gray-400">
          <Store size={16} className="text-[#FFD700]" />
          <h3 className="text-xs font-semibold uppercase tracking-wider">Showcases da Comunidade</h3>
        </div>
        {!loading && showcases.length > 0 && (
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

      <div className="relative flex-1 min-h-[140px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#FFD700] animate-spin" />
          </div>
        ) : showcases.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-500 text-center px-4">
            Nenhum showcase publicado ainda.
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 scrollbar-hide px-2 snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* CSS to hide scrollbar for webkit added via inline style logic or tailwind if configured, but safe inline */}
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                  display: none;
              }
            `}</style>
            
            {showcases.map((showcase) => (
              <div key={showcase.id} className="snap-start">
                <ShowcasePreviewCard showcase={showcase} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}