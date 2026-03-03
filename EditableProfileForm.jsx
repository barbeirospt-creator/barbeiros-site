import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, FileText, Loader2 } from 'lucide-react';

export const EditableProfileForm = ({ initialData, onSave, loading }) => {
  const [formData, setFormData] = useState({
    display_name: initialData?.display_name || '',
    email: initialData?.email || '',
    full_name: initialData?.full_name || '',
    bio: initialData?.bio || '',
    barbershop_name: initialData?.barbershop_name || '',
    role: initialData?.role || '',
    country: initialData?.country || '',
    city: initialData?.city || '',
    instagram: initialData?.instagram || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.display_name?.trim()) {
      newErrors.display_name = 'O nome é obrigatório';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const formFields = [
    { 
      label: 'Nome de Exibição', 
      field: 'display_name', 
      icon: User, 
      placeholder: 'Como deseja ser chamado',
      required: true
    },
    { 
      label: 'Nome Completo', 
      field: 'full_name', 
      icon: User, 
      placeholder: 'Seu nome completo'
    },
    { 
      label: 'Email', 
      field: 'email', 
      icon: Mail, 
      placeholder: 'seu@email.com',
      type: 'email',
      required: true
    },
    { 
      label: 'Nome da Barbearia', 
      field: 'barbershop_name', 
      icon: User, 
      placeholder: 'Nome do seu negócio'
    },
    { 
      label: 'Cargo', 
      field: 'role', 
      icon: User, 
      placeholder: 'Ex: Barbeiro, Proprietário'
    },
    { 
      label: 'País', 
      field: 'country', 
      icon: MapPin, 
      placeholder: 'Portugal'
    },
    { 
      label: 'Cidade', 
      field: 'city', 
      icon: MapPin, 
      placeholder: 'Lisboa'
    },
    { 
      label: 'Instagram', 
      field: 'instagram', 
      icon: User, 
      placeholder: '@seuperfil'
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {formFields.map((fieldConfig, index) => {
          const Icon = fieldConfig.icon;
          return (
            <motion.div
              key={fieldConfig.field}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={fieldConfig.field === 'bio' ? 'md:col-span-2' : ''}
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {fieldConfig.label}
                {fieldConfig.required && <span className="text-[#FFD700] ml-1">*</span>}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Icon className="w-5 h-5" />
                </div>
                <Input
                  type={fieldConfig.type || 'text'}
                  placeholder={fieldConfig.placeholder}
                  value={formData[fieldConfig.field]}
                  onChange={(e) => handleChange(fieldConfig.field, e.target.value)}
                  className={`pl-11 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FFD700] focus:ring-[#FFD700] transition-all duration-300 ${
                    errors[fieldConfig.field] ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors[fieldConfig.field] && (
                <p className="text-red-500 text-xs mt-1">{errors[fieldConfig.field]}</p>
              )}
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: formFields.length * 0.05, duration: 0.4 }}
          className="md:col-span-2"
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Biografia
          </label>
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-500">
              <FileText className="w-5 h-5" />
            </div>
            <Textarea
              placeholder="Conte um pouco sobre você e sua barbearia..."
              value={formData.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              className="pl-11 bg-gray-900 border-gray-800 text-white placeholder:text-gray-600 focus:border-[#FFD700] focus:ring-[#FFD700] transition-all duration-300 resize-none"
            />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: (formFields.length + 1) * 0.05, duration: 0.4 }}
      >
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black font-semibold py-6 rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              A Guardar...
            </>
          ) : (
            'Guardar Alterações'
          )}
        </Button>
      </motion.div>
    </form>
  );
};