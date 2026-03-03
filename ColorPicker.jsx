
import React from 'react';
import { Input } from '@/components/ui/input';

export default function ColorPicker({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-md border border-gray-700 overflow-hidden flex-shrink-0 cursor-pointer relative"
        >
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer opacity-0"
          />
          <div className="w-full h-full pointer-events-none" style={{ backgroundColor: value || '#000000' }} />
        </div>
        <Input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="bg-gray-900 border-gray-700 text-white font-mono uppercase"
          maxLength={7}
        />
      </div>
    </div>
  );
}
