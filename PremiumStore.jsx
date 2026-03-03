import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Lock, Crown, Plus, TrendingUp, DollarSign, ShoppingCart, Image as ImageIcon, Box } from 'lucide-react';

const PremiumGuard = ({ children }) => {
  const { membershipTier } = useAuth();

  if (membershipTier !== 'premium') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 text-center border border-slate-200">
          <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Acesso Exclusivo Premium</h1>
          <p className="text-xl text-slate-600 mb-8">
            A Loja Premium e o Dashboard de Vendas estão disponíveis apenas para membros Premium.
            Desbloqueie ferramentas avançadas e aumente a sua faturação.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left mb-8">
            <div className="bg-slate-50 p-4 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-2">Venda Produtos</h3>
              <p className="text-sm text-slate-600">Liste produtos ilimitados e alcance milhares de clientes.</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl">
              <h3 className="font-bold text-slate-900 mb-2">Sem Comissões</h3>
              <p className="text-sm text-slate-600">Mantenha 100% dos seus lucros nas vendas diretas.</p>
            </div>
          </div>
          <Link to="/membership-plans">
            <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold px-8">
              <Crown className="w-5 h-5 mr-2" />
              Atualizar para Premium
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return children;
};

const ProductForm = ({ onCancel, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onSubmit();
    }, 1500);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
      <h3 className="text-xl font-bold mb-6">Adicionar Novo Produto</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Produto</label>
          <Input placeholder="Ex: Cera Modeladora Matte" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Preço (€)</label>
            <Input type="number" step="0.01" placeholder="0.00" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
            <Input type="number" placeholder="10" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
          <textarea className="w-full border rounded-md p-2 min-h-[100px]" placeholder="Descreva o seu produto..." required></textarea>
        </div>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
          <ImageIcon className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-sm text-slate-600">Clique para fazer upload de imagens</p>
        </div>
        <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
          <p>ℹ️ Membros Premium pagam 0% de comissão sobre vendas.</p>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'A publicar...' : 'Publicar Produto'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export const PremiumStore = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);

  const myProducts = [
    { id: 1, name: 'Pomada Matte', price: 15.00, sales: 45, revenue: 675.00 },
    { id: 2, name: 'Óleo de Barba', price: 12.50, sales: 32, revenue: 400.00 },
  ];

  const marketplaceProducts = [
    { id: 101, name: 'Kit Tesouras Pro', seller: 'BarberTools', price: 120.00, image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c' },
    { id: 102, name: 'Cadeira Vintage', seller: 'Móveis & Cia', price: 450.00, image: 'https://images.unsplash.com/photo-1695173122226-3a932002ab33' },
    { id: 103, name: 'Shampoo Fortalecedor', seller: 'Natural Care', price: 18.00, image: 'https://images.unsplash.com/photo-1635865165118-917ed9e20936' },
  ];

  const handleProductSubmit = () => {
    setShowAddProduct(false);
    toast({
      title: "Produto Publicado!",
      description: "O seu produto está agora disponível no marketplace.",
    });
  };

  const handleBuy = (productName) => {
    toast({
      title: "Adicionado ao Carrinho",
      description: `${productName} foi adicionado. O checkout será processado via Stripe.`,
    });
  };

  return (
    <PremiumGuard>
      <div className="min-h-screen bg-slate-50 pb-12">
        <div className="bg-slate-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                  <Crown className="text-yellow-500" />
                  Premium Store
                </h1>
                <p className="text-slate-300">Gestão de vendas e marketplace exclusivo.</p>
              </div>
              <div className="flex bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  O Meu Negócio
                </button>
                <button
                  onClick={() => setActiveTab('marketplace')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'marketplace' ? 'bg-primary text-white' : 'text-slate-300 hover:text-white'}`}
                >
                  Marketplace
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-slate-500 font-medium">Receita Total</h3>
                    <DollarSign className="text-green-500 w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">1.075,00 €</p>
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 mr-1" /> +12% este mês
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-slate-500 font-medium">Vendas</h3>
                    <ShoppingCart className="text-blue-500 w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">77</p>
                  <p className="text-sm text-slate-600 mt-2">Produtos vendidos</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-slate-500 font-medium">Produtos Ativos</h3>
                    <Box className="text-purple-500 w-6 h-6" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{myProducts.length}</p>
                  <Button variant="link" className="text-primary p-0 h-auto mt-2" onClick={() => setShowAddProduct(true)}>
                    + Adicionar novo
                  </Button>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900">Os Meus Produtos</h2>
                      <Button onClick={() => setShowAddProduct(true)} className="gap-2">
                        <Plus className="w-4 h-4" /> Novo Produto
                      </Button>
                    </div>

                    {showAddProduct ? (
                      <ProductForm onCancel={() => setShowAddProduct(false)} onSubmit={handleProductSubmit} />
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b text-left text-sm text-slate-500">
                              <th className="pb-3 pl-2">Produto</th>
                              <th className="pb-3">Preço</th>
                              <th className="pb-3">Vendas</th>
                              <th className="pb-3">Receita</th>
                              <th className="pb-3">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {myProducts.map(product => (
                              <tr key={product.id} className="border-b last:border-0 hover:bg-slate-50">
                                <td className="py-4 pl-2 font-medium text-slate-900">{product.name}</td>
                                <td className="py-4 text-slate-600">{product.price.toFixed(2)}€</td>
                                <td className="py-4 text-slate-600">{product.sales}</td>
                                <td className="py-4 font-bold text-green-600">{product.revenue.toFixed(2)}€</td>
                                <td className="py-4">
                                  <Button variant="ghost" size="sm">Editar</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20 h-fit">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Dicas Premium
                  </h3>
                  <ul className="space-y-4 text-sm text-slate-700">
                    <li className="flex gap-2">
                      <div className="min-w-[6px] h-[6px] rounded-full bg-primary mt-1.5"></div>
                      Use fotos de alta qualidade para aumentar a conversão em até 40%.
                    </li>
                    <li className="flex gap-2">
                      <div className="min-w-[6px] h-[6px] rounded-full bg-primary mt-1.5"></div>
                      Descrições detalhadas reduzem as dúvidas dos compradores.
                    </li>
                    <li className="flex gap-2">
                      <div className="min-w-[6px] h-[6px] rounded-full bg-primary mt-1.5"></div>
                      Promova os seus produtos nas redes sociais usando o link direto.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Destaques Premium</h2>
                <Button variant="outline" className="gap-2">
                  <ShoppingCart className="w-4 h-4" /> Carrinho (0)
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {marketplaceProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all"
                  >
                    <div className="h-48 overflow-hidden relative group">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Crown className="w-3 h-3" /> Premium
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-slate-500 mb-3">Vendido por: {product.seller}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-bold text-primary">{product.price.toFixed(2)}€</span>
                        <Button size="sm" onClick={() => handleBuy(product.name)}>Comprar</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PremiumGuard>
  );
};