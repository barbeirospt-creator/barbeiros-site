
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ConfirmationDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel", 
  isLoading 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">{title}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="border-gray-700 text-gray-300 hover:bg-gray-800">
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading} className="bg-red-600 hover:bg-red-700 text-white">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
