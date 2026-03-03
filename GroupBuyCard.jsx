
import React, { useState, useEffect } from 'react';
import { useGroupBuyCountdown } from '@/hooks/useGroupBuyCountdown';
import { useGroupBuyManagement } from '@/hooks/useGroupBuyManagement';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Clock, Users, Package, CheckCircle2 } from 'lucide-react';

export default function GroupBuyCard({ groupBuy, onRefresh }) {
  const { timeRemaining, isExpired } = useGroupBuyCountdown(groupBuy.deadline);
  const { joinGroupBuy, checkUserJoined, loading } = useGroupBuyManagement();
  const [participation, setParticipation] = useState(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const fetchParticipationStatus = async () => {
    const data = await checkUserJoined(groupBuy.id);
    setParticipation(data);
  };

  useEffect(() => {
    fetchParticipationStatus();
  }, [groupBuy.id]);

  const hasJoined = !!participation;
  const isFull = groupBuy.max_participants && groupBuy.current_participants >= groupBuy.max_participants;
  const canJoin = !isExpired && !isFull && !hasJoined && groupBuy.status === 'active';

  const handleJoin = async () => {
    if (quantity < 1) return;
    const { error } = await joinGroupBuy(groupBuy.id, parseInt(quantity));
    if (error) {
      toast({ title: 'Erro', description: 'Não foi possível juntar-se à compra.', variant: 'destructive' });
    } else {
      toast({ title: 'Sucesso', description: 'Juntou-se à compra em grupo!' });
      setIsJoinModalOpen(false);
      await fetchParticipationStatus();
      if (onRefresh) onRefresh();
    }
  };

  return (
    <>
      <tr className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors group">
        <td className="p-4">
          <div className="font-semibold text-white flex items-center gap-2">
            <Package size={16} className="text-[#FFD700]" />
            {groupBuy.title}
          </div>
          <div className="text-sm text-gray-400 mt-1">{groupBuy.description}</div>
        </td>
        <td className="p-4 text-gray-300">
          €{groupBuy.unit_price?.toFixed(2)}
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Users size={16} className="text-gray-400" />
            {groupBuy.current_participants || 0} {groupBuy.max_participants ? `/ ${groupBuy.max_participants}` : ''}
          </div>
        </td>
        <td className="p-4">
          <div className={`flex items-center gap-2 text-sm ${isExpired ? 'text-red-400' : 'text-green-400'}`}>
            <Clock size={16} />
            {timeRemaining}
          </div>
        </td>
        <td className="p-4 text-right">
          {hasJoined ? (
            <div className="flex flex-col items-end">
              <Badge variant="outline" className="bg-green-600/20 text-green-400 border-green-600/50 flex items-center gap-1">
                <CheckCircle2 size={12} />
                Inscrito ({participation.quantity_ordered}x)
              </Badge>
            </div>
          ) : (
            <Button 
              disabled={!canJoin || loading} 
              onClick={() => setIsJoinModalOpen(true)}
              size="sm"
              className={isFull ? "bg-gray-700 text-gray-400 cursor-not-allowed" : isExpired ? "bg-red-900/50 text-red-400 cursor-not-allowed" : "bg-[#FFD700] text-black hover:bg-[#FFA500]"}
            >
              {isFull ? 'Esgotado' : isExpired ? 'Expirado' : 'Aderir'}
            </Button>
          )}
        </td>
      </tr>

      <Dialog open={isJoinModalOpen} onOpenChange={setIsJoinModalOpen}>
        <DialogContent className="bg-black border border-gray-800 text-white sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Aderir à Compra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-400">Produto: <span className="text-white font-medium">{groupBuy.title}</span></p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Quantidade</label>
              <Input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(e.target.value)} 
                className="bg-gray-900 border-gray-700 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsJoinModalOpen(false)} className="border-gray-700 text-gray-300">Cancelar</Button>
            <Button onClick={handleJoin} disabled={loading} className="bg-[#FFD700] text-black hover:bg-[#FFA500]">
              {loading ? 'A processar...' : 'Confirmar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Temporary Badge component inline if not imported
function Badge({ children, className, variant }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </span>
  )
}
