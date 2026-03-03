import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const PaymentErrorHandler = ({ error, onRetry, canRetry = true }) => {
  if (!error) return null;

  let message = "Ocorreu um erro desconhecido.";
  let isRetryable = false;

  // Stripe specific error mapping
  if (typeof error === 'string') {
    message = error;
  } else if (error.code) {
    switch (error.code) {
      case 'card_declined':
        message = "O cartão foi recusado. Por favor tente outro meio de pagamento.";
        break;
      case 'insufficient_funds':
        message = "Saldo insuficiente.";
        break;
      case 'expired_card':
        message = "O cartão expirou.";
        break;
      case 'processing_error':
        message = "Erro no processamento. Tente novamente mais tarde.";
        isRetryable = true;
        break;
      default:
        message = error.message || "Erro no pagamento.";
        isRetryable = true;
    }
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-red-800">Erro no Pagamento</h4>
        <p className="text-sm text-red-700 mt-1">{message}</p>
        
        {canRetry && (isRetryable || onRetry) && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 bg-white border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
            onClick={onRetry}
          >
            <RefreshCw className="w-3 h-3 mr-2" /> Tentar Novamente
          </Button>
        )}
      </div>
    </div>
  );
};