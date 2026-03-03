
import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';

export default function ContactFormComponent() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let timeout;
    if (successMessage || errorMessage) {
      timeout = setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 5000);
    }
    return () => clearTimeout(timeout);
  }, [successMessage, errorMessage]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'O email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    }
    
    if (!formData.subject.trim()) newErrors.subject = 'O assunto é obrigatório';
    
    if (!formData.message.trim()) {
      newErrors.message = 'A mensagem é obrigatória';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'A mensagem deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error || (data && data.error)) {
        throw new Error(error?.message || data?.error || 'Falha ao enviar mensagem');
      }

      setSuccessMessage('Mensagem enviada com sucesso! Obrigado pelo contacto.');
      toast({
        title: "Sucesso!",
        description: "Mensagem enviada com sucesso! Obrigado pelo contacto.",
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error('Submission error:', err);
      const errorMsg = 'Ocorreu um erro ao enviar a mensagem. Verifique a sua ligação ou tente novamente mais tarde.';
      setErrorMessage(errorMsg);
      toast({
        title: "Erro",
        description: errorMsg,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-8 rounded-xl border border-zinc-800">
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <p>{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name" className="text-gray-300">Nome <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="O seu nome completo"
          className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 ${errors.name ? 'border-red-500' : 'focus:border-[#FCD34D]'}`}
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-300">Email <span className="text-red-500">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="o.seu.email@exemplo.com"
          className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 ${errors.email ? 'border-red-500' : 'focus:border-[#FCD34D]'}`}
          disabled={isSubmitting}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-gray-300">Assunto <span className="text-red-500">*</span></Label>
        <Input
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Como podemos ajudar?"
          className={`bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 ${errors.subject ? 'border-red-500' : 'focus:border-[#FCD34D]'}`}
          disabled={isSubmitting}
        />
        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-300">Mensagem <span className="text-red-500">*</span></Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Descreva a sua questão ou mensagem com detalhe..."
          className={`min-h-[150px] bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 ${errors.message ? 'border-red-500' : 'focus:border-[#FCD34D]'}`}
          disabled={isSubmitting}
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#FCD34D] hover:bg-[#FBBF24] text-black font-semibold py-6 text-lg transition-all"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            A Enviar...
          </>
        ) : (
          'Enviar Mensagem'
        )}
      </Button>
    </form>
  );
}
