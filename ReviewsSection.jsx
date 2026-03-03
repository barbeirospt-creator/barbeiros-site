import React, { useState } from 'react';
import { Star, ThumbsUp, MessageSquare, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const ReviewsSection = ({ reviews, rating, reviewCount }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filterRating, setFilterRating] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const filteredReviews = reviews
    .filter(review => filterRating === 'all' || review.rating === parseInt(filterRating))
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return 0;
    });

  const handleAddReview = () => {
    if (!user) {
      toast({
        title: "Sessão necessária",
        description: "Precisa de iniciar sessão para deixar uma avaliação.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "O formulário de avaliações estará disponível em breve.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Summary */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center justify-center bg-white w-24 h-24 rounded-full shadow-sm border border-slate-100">
            <span className="text-3xl font-bold text-slate-900">{rating}</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 mt-1">{reviewCount} avaliações</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Avaliação Geral</h3>
            <p className="text-slate-500 text-sm">Baseado na opinião dos nossos clientes.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button onClick={handleAddReview} className="w-full md:w-auto">
            Deixar Avaliação
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0">
          <button 
            onClick={() => setFilterRating('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${filterRating === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            Todas
          </button>
          {[5, 4, 3, 2, 1].map(star => (
            <button 
              key={star}
              onClick={() => setFilterRating(star)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 whitespace-nowrap ${filterRating === star ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}
            >
              {star} <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        <select 
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigas</option>
          <option value="highest">Melhor classificação</option>
          <option value="lowest">Pior classificação</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            Nenhuma avaliação encontrada com os filtros selecionados.
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{review.author}</h4>
                    <span className="text-xs text-slate-500">{new Date(review.date).toLocaleDateString('pt-PT')}</span>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-slate-700 mb-4">{review.comment}</p>
              
              {review.response && (
                <div className="bg-slate-50 p-4 rounded-lg border-l-4 border-primary mt-4">
                  <p className="text-xs font-bold text-primary mb-1">Resposta da Barbearia</p>
                  <p className="text-sm text-slate-600 italic">"{review.response}"</p>
                </div>
              )}
              
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-50 text-slate-400">
                <button className="flex items-center gap-1 text-xs hover:text-slate-600 transition-colors">
                  <ThumbsUp className="w-3 h-3" /> Útil
                </button>
                <button className="flex items-center gap-1 text-xs hover:text-slate-600 transition-colors">
                  <MessageSquare className="w-3 h-3" /> Responder
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};