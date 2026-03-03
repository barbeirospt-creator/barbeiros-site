
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

const AVAILABLE_PERMISSIONS = [
  { id: 'manage_products', label: 'Manage Products' },
  { id: 'manage_orders', label: 'Manage Orders' },
  { id: 'manage_users', label: 'Manage Users' },
  { id: 'manage_settings', label: 'Manage Settings' },
  { id: 'manage_forum', label: 'Manage Forum' },
  { id: 'manage_compras', label: 'Manage Compras' }
];

export default function EditUserModal({ isOpen, onClose, onSave, item, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Admin',
    permissions: [],
    is_active: true
  });

  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        name: item.name || '',
        email: item.email || '',
        role: item.role || 'Admin',
        permissions: item.permissions || [],
        is_active: item.is_active !== undefined ? item.is_active : true
      });
    } else if (isOpen && !item) {
      setFormData({
        name: '',
        email: '',
        role: 'Admin',
        permissions: [],
        is_active: true
      });
    }
  }, [isOpen, item]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (permId, checked) => {
    setFormData(prev => {
      const current = prev.permissions || [];
      if (checked) {
        return { ...prev, permissions: [...current, permId] };
      } else {
        return { ...prev, permissions: current.filter(p => p !== permId) };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      permissions: formData.permissions,
      is_active: formData.is_active
    });
  };

  const inputClasses = "bg-black border-gray-700 text-white focus:border-transparent focus:ring-2 focus:ring-[#FFD700] transition-shadow";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">
            {item ? 'Editar Utilizador' : 'Novo Utilizador'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Nome *</label>
            <Input
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={inputClasses}
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email *</label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={inputClasses}
              placeholder="Ex: joao@exemplo.com"
              disabled={!!item} // Prevent changing email on edit if desired, or allow if handled by backend
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Role</label>
            <Select value={formData.role} onValueChange={(val) => handleChange('role', val)}>
              <SelectTrigger className={inputClasses}>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-white">
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Editor">Editor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-800">
            <label className="text-sm font-medium text-gray-300 block mb-2">Permissões</label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_PERMISSIONS.map(perm => (
                <label key={perm.id} className="flex items-center space-x-2 text-sm text-gray-400 cursor-pointer">
                  <input 
                    type="checkbox"
                    className="rounded border-gray-700 bg-black text-[#FFD700] focus:ring-[#FFD700]"
                    checked={(formData.permissions || []).includes(perm.id)}
                    onChange={(e) => handlePermissionChange(perm.id, e.target.checked)}
                  />
                  <span>{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-800 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">Utilizador Ativo</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFD700]"></div>
            </label>
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 pt-4">
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
              Guardar Utilizador
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
