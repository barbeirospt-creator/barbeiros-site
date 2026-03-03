import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// This would typically come from your environment variables
const stripePromise = loadStripe('pk_test_placeholder_key'); 

const CheckoutForm = ({ amount, bookingId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/receipt/${bookingId}`,
      },
      redirect: "if_required"
    });

    if (error) {
      toast({
        title: "Erro no Pagamento",
        description: error.message,
        variant: "destructive"
      });
      setLoading(false);
    } else {
      // Success
      toast({ title: "Pagamento Confirmado!" });
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Pagar {amount}€
      </Button>
    </form>
  );
};

export const StripePayment = ({ bookingId, amount, clientName, barbershopName }) => {
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const createIntent = async () => {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
            body: { amount, currency: 'eur', bookingId }
        });
        
        if (data?.clientSecret) {
            setClientSecret(data.clientSecret);
        }
    };
    
    // createIntent(); // Disabled until edge function is ready
    // Mocking for UI demonstration
    setClientSecret("pi_mock_secret_123456"); 
  }, [amount, bookingId]);

  if (!clientSecret) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
  }

  // Note: Elements provider normally wraps the app or page, but here we wrap the form locally for modularity
  // In a real implementation with a real key, this would render the Stripe Elements
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-bold text-lg mb-4">Pagamento Seguro</h3>
        <p className="text-sm text-slate-500 mb-6">Pagamento para {barbershopName} - {amount}€</p>
        
        {/* Mock for demo since no real stripe key */}
        <div className="p-4 border rounded bg-slate-50 mb-4 text-center text-sm text-slate-500">
            Stripe Elements Mock (Enter Test Card)
        </div>
        <Button className="w-full" onClick={() => { console.log('Paid'); }}>Simular Pagamento</Button>
    </div>
  );
};