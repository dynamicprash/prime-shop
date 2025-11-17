import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast.js';
import { createOrder, confirmOrderPayment } from '../api/orders.js';
import { useCart } from '../contexts/useCart.jsx';

const PaymentSuccess = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('processing');
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    const rawOrder = sessionStorage.getItem('pendingOrder');

    if (!rawOrder) {
      setStatus('missing');
      return;
    }

    const orderPayload = JSON.parse(rawOrder);
    const finalizeOrder = async () => {
      if (hasProcessedRef.current) {
        return;
      }
      hasProcessedRef.current = true;

      try {
        const order = await createOrder({
          items: orderPayload.items,
          shipping: orderPayload.shipping,
        });
        
        // Auto-confirm order status after successful payment
        if (order?._id) {
          try {
            await confirmOrderPayment(order._id);
          } catch (statusError) {
            console.warn('Could not auto-confirm order status:', statusError);
            // Non-critical: order is created, status update can be done manually
          }
        }
        
        clearCart();
        sessionStorage.removeItem('pendingOrder');
        setStatus('success');
        toast({
          title: 'Payment confirmed',
          description: 'Your order has been placed and confirmed successfully.',
        });
      } catch (error) {
        console.error('Failed to finalize order after eSewa payment', error);
        setStatus('error');
        toast({
          title: 'Unable to finalize order',
          description: 'We could not confirm your payment automatically. Please contact support.',
          variant: 'destructive',
        });
      }
    };

    finalizeOrder();
  }, [clearCart, toast]);

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-semibold">Processing your payment…</h1>
        <p className="text-muted-foreground">Please wait while we confirm your order.</p>
      </div>
    );
  }

  if (status === 'missing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-semibold">No pending payment found</h1>
        <p className="text-muted-foreground">
          We could not find a payment in progress. If you already completed a payment, your order might be confirmed
          already.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-semibold text-destructive">We hit a snag</h1>
        <p className="text-muted-foreground">
          Something went wrong while confirming your payment. Please reach out to support with your payment details.
        </p>
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <h1 className="text-3xl font-bold">Thank you for your purchase! 🎉</h1>
      <p className="text-muted-foreground">
        Your payment was successful and your order is now confirmed. You can continue browsing for more products.
      </p>
      <Link
        to="/products"
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Browse Products
      </Link>
    </div>
  );
};

export default PaymentSuccess;


