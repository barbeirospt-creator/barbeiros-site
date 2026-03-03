
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, onSave, title, fields, isLoading }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen) {
      const initialData = {};
      fields.forEach(field => {
        initialData[field.name] = field.value || '';
      });
      setFormData(initialData);
    }
  }, [isOpen, fields]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <Textarea
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="bg-black border-gray-800 text-white focus:border-[#FFD700]"
                  required={field.required}
                />
              ) : (
                <Input
                  type={field.type || 'text'}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="bg-black border-gray-800 text-white focus:border-[#FFD700]"
                  required={field.required}
                />
              )}
            </div>
          ))}
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="border-gray-700 text-gray-300 hover:bg-gray-800">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#FFD700] hover:bg-[#FFA500] text-black">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
