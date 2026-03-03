import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Search, MapPin, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const ClientHome = () => {
  const [barbershops, setBarbershops] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarbershops();
  }, []);

  const fetchBarbershops = async () => {
    setLoading(true);
    try {
        const { data } = await supabase.from('tabela_barbearias').select('*');
        setBarbershops(data || []);
    } finally {
        setLoading(false);
    }
  };

  const filteredShops = barbershops.filter(shop => 
    shop.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    shop.localizacao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Search */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900 mb-3">Barbeiros.pt</h1>
        <div className="flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Procurar barbearia..." 
                    className="pl-9 bg-slate-100 border-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
            </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar">
         {['Populares', 'Perto de mim', 'Melhor Avaliados', 'Barba', 'Cabelo'].map(cat => (
             <button key={cat} className="px-4 py-1.5 rounded-full bg-white border text-sm whitespace-nowrap font-medium text-slate-600">
                 {cat}
             </button>
         ))}
      </div>

      {/* List */}
      <div className="px-4 space-y-4">
         <h2 className="font-bold text-lg text-slate-800">Barbearias em Destaque</h2>
         
         {loading ? (
             <div className="space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse"/>)}
             </div>
         ) : (
             filteredShops.map(shop => (
                 <Link to={`/mobile/barbershop/${shop.id}`} key={shop.id} className="block group">
                     <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                         <div className="h-32 bg-slate-200 relative">
                             <img 
                                src={shop.logo || "https://images.unsplash.com/photo-1503951914875-452162b7f30a?w=800&q=80"} 
                                alt={shop.nome}
                                className="w-full h-full object-cover"
                             />
                             <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md flex items-center gap-1 text-xs font-bold shadow-sm">
                                 <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                 {shop.avaliacao_media || "4.5"}
                             </div>
                         </div>
                         <div className="p-3">
                             <h3 className="font-bold text-slate-900">{shop.nome}</h3>
                             <div className="flex items-center text-slate-500 text-sm mt-1">
                                 <MapPin className="w-3 h-3 mr-1" />
                                 <span className="truncate">{shop.localizacao}</span>
                             </div>
                             <div className="mt-3 flex items-center justify-between">
                                 <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Aberto agora</div>
                                 <span className="text-xs text-slate-400">1.2 km</span>
                             </div>
                         </div>
                     </div>
                 </Link>
             ))
         )}
         
         {!loading && filteredShops.length === 0 && (
             <div className="text-center py-10 text-slate-500">
                 Nenhuma barbearia encontrada.
             </div>
         )}
      </div>
    </div>
  );
};