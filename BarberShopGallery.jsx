import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, ZoomIn, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { imageService } from '@/services/imageService';
import { useToast } from '@/components/ui/use-toast';

export const BarberShopGallery = ({ images, canUpload = false, barbershopId, onImageUploaded }) => {
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [uploading, setUploading] = useState(false);

  const filteredImages = activeTab === 'All' 
    ? images 
    : images.filter(img => img.category === activeTab);

  const handleNext = (e) => {
    e.stopPropagation();
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setSelectedImage(filteredImages[nextIndex]);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setSelectedImage(filteredImages[prevIndex]);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !barbershopId) return;

    setUploading(true);
    try {
      const { data, error } = await imageService.uploadImage(barbershopId, file);
      if (error) throw error;
      
      toast({ title: "Sucesso!", description: "Imagem enviada com sucesso!" });
      if (onImageUploaded) onImageUploaded(data);
    } catch (error) {
      console.error(error);
      toast({ title: "Erro", description: "Falha no envio da imagem.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex gap-2">
          {['All', 'galeria', 'interior', 'portfolio'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-primary text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'All' ? 'Todas' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        {canUpload && (
          <div className="relative">
            <input 
              type="file" 
              id="gallery-upload" 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button variant="outline" className="gap-2" asChild disabled={uploading}>
              <label htmlFor="gallery-upload" className="cursor-pointer">
                {uploading ? <Upload className="w-4 h-4 animate-bounce" /> : <ImageIcon className="w-4 h-4" />}
                {uploading ? 'A enviar...' : 'Adicionar Foto'}
              </label>
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500">
            Nenhuma imagem disponível.
          </div>
        )}
        {filteredImages.map((image) => (
          <motion.div
            key={image.id}
            layoutId={`image-${image.id}`}
            className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group bg-slate-100"
            onClick={() => setSelectedImage(image)}
          >
            <img 
              src={image.url} 
              alt={image.description || 'Imagem da barbearia'} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-50"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 bg-black/50 rounded-full backdrop-blur-sm"
              onClick={handlePrev}
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <motion.img
              layoutId={`image-${selectedImage.id}`}
              src={selectedImage.url}
              alt={selectedImage.description}
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 bg-black/50 rounded-full backdrop-blur-sm"
              onClick={handleNext}
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};