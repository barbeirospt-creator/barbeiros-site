
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Users, Search, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet';

export default function ClientsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) fetchClients();
  }, [user]);

  const fetchClients = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mocking clients fetch from users/profiles table or similar context
      const { data, error: err } = await supabase
        .from('profiles')
        .select('*')
        .limit(20);
        
      if (err) throw err;
      setClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Não foi possível carregar a lista de clientes.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = () => {
    toast({
      title: "Ação não disponível",
      description: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
    });
  };

  const filteredClients = clients.filter(c => 
    (c.display_name || c.full_name || c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <Helmet>
        <title>Os Meus Clientes | Barbeiros PT</title>
        <meta name="description" content="Faça a gestão da sua lista de clientes e histórico." />
      </Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Users className="text-[#FFD700] h-6 w-6" />
            Clientes
          </h1>
          <p className="text-gray-400 text-sm mt-1">Consulte e gira a sua base de clientes</p>
        </div>
        <Button onClick={handleAction} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
          Adicionar Cliente
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          type="text" 
          placeholder="Pesquisar por nome ou email..." 
          className="pl-10 bg-gray-900 border-gray-800 text-white focus:border-[#FFD700]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 flex items-start gap-3 mb-6">
          <AlertCircle className="text-red-500 mt-0.5" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-[#FFD700] animate-spin" />
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhum cliente encontrado</h3>
          <p className="text-gray-400">Tente ajustar os termos da sua pesquisa.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredClients.map((client) => (
            <Card key={client.id} className="bg-gray-900 border-gray-800">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-[#FFD700] font-bold text-lg border border-gray-700">
                  {(client.display_name || client.full_name || client.email || 'C')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white truncate">
                    {client.display_name || client.full_name || 'Cliente Sem Nome'}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">{client.email || 'Sem email registado'}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleAction} className="text-gray-400 hover:text-[#FFD700]">
                  <Users size={18} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
