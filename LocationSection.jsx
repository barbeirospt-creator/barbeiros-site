import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function LocationSection({ info }) {
  const hasCoordinates = info?.latitude && info?.longitude;
  const position = hasCoordinates ? [info.latitude, info.longitude] : null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Localização e Contactos</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-800 lg:col-span-1">
          <CardContent className="p-6 space-y-6">
            <div>
              <h3 className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wider">Morada</h3>
              <div className="flex items-start gap-3 text-white">
                <MapPin className="text-[#FFD700] mt-1 shrink-0" size={18} />
                <span>{info?.address || 'Morada não definida'}</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wider">Telefone</h3>
              <div className="flex items-center gap-3 text-white">
                <Phone className="text-[#FFD700] shrink-0" size={18} />
                <span>{info?.phone || 'Telefone não definido'}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-gray-500 font-medium mb-2 uppercase tracking-wider">Email</h3>
              <div className="flex items-center gap-3 text-white">
                <Mail className="text-[#FFD700] shrink-0" size={18} />
                <span>{info?.email || 'Email não definido'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-gray-800 lg:col-span-2 overflow-hidden h-[300px] lg:h-auto min-h-[300px] relative z-0">
          {hasCoordinates ? (
            <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup className="text-black">
                  <strong>{info.business_name}</strong><br />
                  {info.address}
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-900">
              Coordenadas de mapa não definidas.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}