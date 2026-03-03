import React from 'react';
import GroupBuyCard from './GroupBuyCard';
import { Card } from '@/components/ui/card';

export default function GroupBuyTable({ groupBuys, loading, onRefresh }) {
  if (loading) {
    return (
      <Card className="bg-black border-gray-800 overflow-hidden">
        <div className="p-8 text-center text-gray-400 animate-pulse">A carregar oportunidades...</div>
      </Card>
    );
  }

  if (!groupBuys || groupBuys.length === 0) {
    return (
      <Card className="bg-black border-gray-800 overflow-hidden">
        <div className="p-12 text-center text-gray-400">Nenhuma compra em grupo ativa de momento.</div>
      </Card>
    );
  }

  return (
    <Card className="bg-black border-gray-800 overflow-hidden shadow-xl rounded-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-900/50 border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Produto</th>
              <th className="p-4 font-medium">Preço Un.</th>
              <th className="p-4 font-medium">Participantes</th>
              <th className="p-4 font-medium">Prazo</th>
              <th className="p-4 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {groupBuys.map((gb) => (
              <GroupBuyCard key={gb.id} groupBuy={gb} onRefresh={onRefresh} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}