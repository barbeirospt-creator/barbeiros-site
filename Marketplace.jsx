import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBag, Search, Plus, Star, Scissors } from 'lucide-react';

export const Marketplace = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Produtos', icon: '🧴', count: 234 },
    { name: 'Serviços', icon: '✂️', count: 156 },
    { name: 'Ferramentas', icon: '🔧', count: 89 }
  ];

  const products = [
    {
      id: 1,
      name: 'Kit Profissional de Máquinas',
      seller: 'BarberTools Pro',
      price: '299€',
      rating: 4.8,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c',
      category: 'Ferramentas'
    },
    {
      id: 2,
      name: 'Pomada Modeladora Premium',
      seller: 'Style Products',
      price: '19.90€',
      rating: 4.9,
      reviews: 234,
      image: 'https://images.unsplash.com/photo-1635865165118-917ed9e20936',
      category: 'Produtos'
    },
    {
      id: 3,
      name: 'Tesoura Profissional Japonesa',
      seller: 'Cutting Edge',
      price: '149€',
      rating: 5.0,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1695173122226-3a932002ab33',
      category: 'Ferramentas'
    },
    {
      id: 4,
      name: 'Óleo para Barba Orgânico',
      seller: 'Natural Beard Co',
      price: '24.90€',
      rating: 4.7,
      reviews: 178,
      image: 'https://images.unsplash.com/photo-1678356163587-6bb3afb89679',
      category: 'Produtos'
    }
  ];

  const handleAddProduct = () => {
    toast({
      title: "Produto adicionado! 🛒",
      description: "Item adicionado ao carrinho com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Scissors className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-slate-900">Barbeiros.pt</span>
            </div>
            <Button onClick={() => window.history.back()} variant="ghost">Voltar</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Marketplace</h1>
          <p className="text-slate-600 text-lg mb-8">Produtos e serviços para profissionais</p>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Procurar produtos, serviços..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-gray-900"
                />
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Vender Item
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{category.name}</h3>
                <p className="text-slate-600">{category.count} itens disponíveis</p>
              </motion.div>
            ))}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Produtos em Destaque</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold text-slate-700">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 mb-1 truncate">{product.name}</h3>
                    <p className="text-sm text-slate-600 mb-2">{product.seller}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-slate-700">{product.rating}</span>
                      </div>
                      <span className="text-xs text-slate-500">({product.reviews} avaliações)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-primary">{product.price}</span>
                      <Button size="sm" onClick={handleAddProduct}>
                        <ShoppingBag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};