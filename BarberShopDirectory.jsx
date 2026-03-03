import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { BarberShopCard } from '@/components/BarberShopCard';
import { barbershopService } from '@/services/barbershopService';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const BarberShopDirectory = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('Todos');
  const [filterPrice, setFilterPrice] = useState('Todos');
  
  const [barbershops, setBarbershops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data, error } = await barbershopService.getBarbershops();
      if (error) {
        setError('Falha ao carregar barbearias');
      } else {
        setBarbershops(data || []);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // Compute filters
  const filteredBarbershops = barbershops.filter(shop => {
    const shopCity = shop.location?.city || '';
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          shopCity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = filterCity === 'Todos' || shopCity === filterCity;
    const matchesPrice = filterPrice === 'Todos' || shop.priceRange === filterPrice;
    
    return matchesSearch && matchesCity && matchesPrice;
  });

  const cities = ['Todos', ...new Set(barbershops.map(s => s.location?.city || 'Unknown'))].filter(Boolean);
  const prices = ['Todos', '€', '€€', '€€€'];

  if (loading) return <div className="min-h-screen flex justify-center items-center">A carregar...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Search & Filter Header */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input 
                placeholder="Nome da barbearia, cidade..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 items-center">
              <div className="flex items-center gap-2 mr-4">
                <Filter className="w-4 h-4 text-slate-500" />
                <select 
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                >
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select 
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2"
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                >
                  {prices.map(p => <option key={p} value={p}>{p === 'Todos' ? 'Preço' : p}</option>)}
                </select>
              </div>
              
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}
        
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBarbershops.map((shop) => (
              <BarberShopCard key={shop.id} barbershop={{
                ...shop,
                services: shop.services || [] // Ensure services array exists for Card
              }} />
            ))}
          </div>
        ) : (
          <div className="h-[calc(100vh-250px)] rounded-xl overflow-hidden shadow-lg border border-slate-200 relative z-0">
            <MapContainer 
              center={[39.5, -8.0]} 
              zoom={7} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredBarbershops.map((shop) => (
                <Marker key={shop.id} position={shop.location.coordinates || [39.5, -8.0]}>
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold text-sm">{shop.name}</h3>
                      <p className="text-xs">{shop.location.city}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}
        
        {filteredBarbershops.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">Nenhuma barbearia encontrada com os filtros selecionados.</p>
          </div>
        )}
      </div>
    </div>
  );
};