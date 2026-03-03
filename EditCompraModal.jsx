
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import CompraParticipantsList from './CompraParticipantsList';

export default function EditCompraModal({ isOpen, onClose, onSave, item, isLoading }) {
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    unit_price: '',
    deadline: '',
    quantity_available: '',
    max_participants: '',
    product_image_url: '',
    status: 'Rascunho'
  });

  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        product_name: item.title || '',
        description: item.description || '',
        unit_price: item.unit_price !== undefined ? item.unit_price : '',
        deadline: item.deadline ? new Date(item.deadline).toISOString().slice(0, 16) : '',
        quantity_available: item.quantity_available !== undefined ? item.quantity_available : '',
        max_participants: item.max_participants !== undefined ? item.max_participants : '',
        product_image_url: item.product_image_url || '',
        status: item.status || 'Rascunho'
      });
    } else if (isOpen && !item) {
      setFormData({
        product_name: '',
        description: '',
        unit_price: '',
        deadline: '',
        quantity_available: '',
        max_participants: '',
        product_image_url: '',
        status: 'Rascunho'
      });
    }
  }, [isOpen, item]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { product_name, ...rest } = formData;
    
    onSave({
      ...rest,
      title: product_name,
      deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
      unit_price: parseFloat(formData.unit_price) || 0,
      quantity_available: formData.quantity_available ? parseInt(formData.quantity_available) : null,
      max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
    });
  };

  const inputClasses = "bg-black border-gray-700 text-white focus:border-transparent focus:ring-2 focus:ring-[#FFD700] transition-shadow";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="bg-gray-900 border-gray-800 text-white sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        aria-describedby="edit-compra-description"
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {item ? 'Editar Compra em Grupo' : 'Nova Compra em Grupo'}
          </DialogTitle>
          <DialogDescription id="edit-compra-description" className="sr-only">
            Preencha os detalhes para criar ou editar uma compra em grupo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome do Produto */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Nome do Produto *</label>
              <Input
                required
                value={formData.product_name}
                onChange={(e) => handleChange('product_name', e.target.value)}
                className={inputClasses}
                placeholder="Ex: Máquina de Cortar Cabelo Wahl"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={inputClasses}
                rows={3}
                placeholder="Detalhes do produto..."
              />
            </div>

            {/* Preço Unitário */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Preço Unitário (€) *</label>
              <Input
                required
                type="number"
                step="0.01"
                min="0"
                value={formData.unit_price}
                onChange={(e) => handleChange('unit_price', e.target.value)}
                className={inputClasses}
                placeholder="0.00"
              />
            </div>

            {/* Prazo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Prazo (Data e Hora) *</label>
              <Input
                required
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                className={inputClasses}
              />
            </div>

            {/* Quantidade Disponível */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Quantidade Disponível</label>
              <Input
                type="number"
                min="0"
                value={formData.quantity_available}
                onChange={(e) => handleChange('quantity_available', e.target.value)}
                className={inputClasses}
                placeholder="Ex: 50"
              />
            </div>

            {/* Máx. Participantes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Máx. Participantes</label>
              <Input
                type="number"
                min="0"
                value={formData.max_participants}
                onChange={(e) => handleChange('max_participants', e.target.value)}
                className={inputClasses}
                placeholder="Ex: 100"
              />
            </div>

            {/* URL da Imagem */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">URL da Imagem</label>
              <Input
                type="url"
                value={formData.product_image_url}
                onChange={(e) => handleChange('product_image_url', e.target.value)}
                className={inputClasses}
                placeholder="https://..."
              />
            </div>

            {/* Estado */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Estado</label>
              <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-800 text-white">
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
                  <SelectItem value="Ativa">Ativa</SelectItem>
                  <SelectItem value="Fechada">Fechada</SelectItem>
                  <SelectItem value="Expirada">Expirada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {item && item.id && (
            <div className="mt-6 pt-4 border-t border-gray-800">
              <CompraParticipantsList purchaseId={item.id} />
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
            <Button 
              type="button" 
              onClick={onClose} 
              disabled={isLoading} 
              className="border border-gray-700 bg-transparent text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="bg-[#FFD700] hover:bg-[#FFA500] text-black"
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar Compra
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
