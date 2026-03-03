import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { reviewService } from '@/services/reviewService';
import { Star } from 'lucide-react';

export const ReviewForm = ({ barbershopId, onReviewAdded }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    author: '',
    comment: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: "Erro", description: "Por favor selecione uma classificação.", variant: "destructive" });
      return;
    }
    if (formData.comment.length < 5) {
       toast({ title: "Erro", description: "O comentário deve ter pelo menos 5 caracteres.", variant: "destructive" });
       return;
    }

    setLoading(true);
    try {
      const { error } = await reviewService.createReview({
        ...formData,
        rating,
        barbershopId
      });

      if (error) throw error;

      toast({ title: "Sucesso!", description: "Avaliação adicionada com sucesso!" });
      setFormData({ author: '', comment: '' });
      setRating(0);
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      toast({ title: "Erro", description: "Falha ao adicionar avaliação.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 mt-8">
      <h3 className="font-bold text-lg mb-4">Deixe a sua avaliação</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none transition-colors"
            >
              <Star 
                className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} 
              />
            </button>
          ))}
        </div>
        
        <div>
          <label className="text-sm font-medium">O seu nome</label>
          <Input 
            required
            value={formData.author}
            onChange={e => setFormData({...formData, author: e.target.value})}
            placeholder="João Silva"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Comentário</label>
          <textarea 
            className="w-full min-h-[80px] rounded-md border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
            required
            value={formData.comment}
            onChange={e => setFormData({...formData, comment: e.target.value})}
            placeholder="Conte-nos como foi a sua experiência..."
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'A enviar...' : 'Enviar Avaliação'}
        </Button>
      </form>
    </div>
  );
};