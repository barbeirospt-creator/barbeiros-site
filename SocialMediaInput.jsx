
import React from 'react';
import { Input } from '@/components/ui/input';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, MessageCircle, Send } from 'lucide-react';

const ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
  whatsapp: MessageCircle,
  telegram: Send,
  tiktok: MessageCircle // Fallback
};

export default function SocialMediaInput({ platform, value, onChange, placeholder }) {
  const Icon = ICONS[platform] || MessageCircle;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300 capitalize">{platform}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
          <Icon className="w-4 h-4" />
        </div>
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || `https://${platform}.com/...`}
          className="bg-gray-900 border-gray-700 text-white pl-10"
        />
      </div>
    </div>
  );
}
