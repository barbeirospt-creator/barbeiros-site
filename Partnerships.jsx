import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Search, Star, ExternalLink, Mail, ShieldCheck, BookOpen, Laptop, Calculator, ShoppingBag, Store } from 'lucide-react';
import { BarberShopDirectory } from '@/pages/BarberShopDirectory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PartnerReviews = ({ reviews, rating, reviewsCount }) => {
  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
            />
          ))}
        </div>
        <span className="font-bold text-slate-900">{rating}</span>
        <span className="text-sm text-slate-500">({reviewsCount} avaliações)</span>
      </div>
      
      <div className="space-y-3">
        {reviews.slice(0, 2).map((review, idx) => (
          <div key={idx} className="bg-slate-50 p-3 rounded-lg text-sm">
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-slate-900">{review.user}</span>
              <div className="flex">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
            <p className="text-slate-600">{review.comment}</p>
          </div>
        ))}
        {reviews.length > 2 && (
          <button className="text-primary text-xs font-semibold hover:underline">
            Ver todas as {reviewsCount} avaliações
          </button>
        )}
      </div>
    </div>
  );
};

export const Partnerships = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = [
    { id: 'Todos', label: 'Todos', icon: null },
    { id: 'Produtos', label: 'Produtos', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'Fornecedores', label: 'Fornecedores', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'Formação', label: 'Formação', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Software', label: 'Software', icon: <Laptop className="w-4 h-4" /> },
    { id: 'Contabilidade', label: 'Contabilidade', icon: <Calculator className="w-4 h-4" /> },
  ];

  const partners = [
    {
      id: 1,
      name: "BarberSupplies Pro",
      category: "Produtos",
      logo: "BP",
      color: "bg-blue-600",
      description: "O maior fornecedor de produtos de barbearia em Portugal com descontos exclusivos para membros.",
      rating: 4.8,
      reviewsCount: 124,
      discount: "15% de desconto em toda a loja",
      website: "https://example.com",
      reviews: [
        { user: "João S.", rating: 5, comment: "Entrega super rápida e produtos de qualidade." },
        { user: "Carlos M.", rating: 4, comment: "Bons preços para compras em quantidade." }
      ]
    },
    {
      id: 2,
      name: "Academia Corte Real",
      category: "Formação",
      logo: "AC",
      color: "bg-purple-600",
      description: "Workshops e cursos avançados de técnicas de corte e gestão de barbearias.",
      rating: 4.9,
      reviewsCount: 56,
      discount: "20% na inscrição de qualquer curso",
      website: "https://example.com",
      reviews: [
        { user: "Pedro L.", rating: 5, comment: "O workshop de fade mudou a minha carreira!" }
      ]
    },
    {
      id: 3,
      name: "Contas Certas",
      category: "Contabilidade",
      logo: "CC",
      color: "bg-green-600",
      description: "Serviços de contabilidade especializados para o setor da beleza e estética.",
      rating: 4.5,
      reviewsCount: 32,
      discount: "1ª mensalidade grátis",
      website: "https://example.com",
      reviews: [
        { user: "Rui F.", rating: 4, comment: "Muito profissionais e sempre disponíveis." }
      ]
    },
    {
      id: 4,
      name: "TechBarber Soft",
      category: "Software",
      logo: "TB",
      color: "bg-indigo-600",
      description: "Software de gestão de filas e displays digitais para a sua barbearia.",
      rating: 4.2,
      reviewsCount: 18,
      discount: "30% na licença anual",
      website: "https://example.com",
      reviews: [
        { user: "Miguel A.", rating: 4, comment: "Simples de usar e ajuda muito na organização." }
      ]
    },
    {
      id: 5,
      name: "Lâminas & Cia",
      category: "Fornecedores",
      logo: "LC",
      color: "bg-red-600",
      description: "Distribuidor oficial das melhores marcas de lâminas e tesouras.",
      rating: 4.7,
      reviewsCount: 89,
      discount: "Preços de revenda sem mínimo",
      website: "https://example.com",
      reviews: [
        { user: "André P.", rating: 5, comment: "Material de topo, recomendo." }
      ]
    }
  ];

  const filteredPartners = partners.filter(partner => {
    const matchesCategory = selectedCategory === 'Todos' || partner.category === selectedCategory;
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          partner.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContact = (partnerName) => {
    toast({
      title: "Pedido de contacto enviado",
      description: `A equipa da ${partnerName} entrará em contacto brevemente.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Rede de Parceiros</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            Descubra a nossa rede de benefícios e as melhores barbearias de Portugal.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <Tabs defaultValue="partners" className="w-full">
          <div className="bg-white rounded-xl shadow-lg p-2 mb-8 inline-flex">
            <TabsList className="bg-slate-100 p-1">
              <TabsTrigger value="partners" className="gap-2 px-6">
                <ShieldCheck className="w-4 h-4" /> Parceiros & Benefícios
              </TabsTrigger>
              <TabsTrigger value="barbershops" className="gap-2 px-6">
                <Store className="w-4 h-4" /> Diretório de Barbearias
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="partners">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-slate-100">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input 
                    placeholder="Procurar parceiros..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                        selectedCategory === cat.id 
                          ? 'bg-primary text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.map((partner, index) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`${partner.color} w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-md`}>
                          {partner.logo}
                        </div>
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase">
                          {partner.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{partner.name}</h3>
                      <p className="text-slate-600 text-sm mb-4 min-h-[40px]">{partner.description}</p>
                      
                      <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 fill-green-600 text-green-600" />
                        <span className="font-bold text-sm">{partner.discount}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="w-full gap-2" onClick={() => window.open(partner.website, '_blank')}>
                          <ExternalLink className="w-4 h-4" />
                          Website
                        </Button>
                        <Button className="w-full gap-2" onClick={() => handleContact(partner.name)}>
                          <Mail className="w-4 h-4" />
                          Contactar
                        </Button>
                      </div>

                      <PartnerReviews 
                        reviews={partner.reviews} 
                        rating={partner.rating} 
                        reviewsCount={partner.reviewsCount} 
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredPartners.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500 text-lg">Nenhum parceiro encontrado com os filtros selecionados.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="barbershops">
             <BarberShopDirectory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};