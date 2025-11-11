import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useCart } from '../contexts/useCart.jsx';
import { useAuth } from '../contexts/authContext.jsx';
import { useToast } from '../hooks/use-toast.js';
import EsewaForm from '../api/esewa.jsx';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [esewaPayload, setEsewaPayload] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    [items]
  );

  const shipping = useMemo(
    () => ({
      phone: formData.phone,
      streetAddress: formData.address,
      city: formData.city,
      zipCode: formData.zipCode,
    }),
    [formData.address, formData.city, formData.phone, formData.zipCode]
  );

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        toast({
          title: 'Please sign in',
          description: 'You need an account to complete your order.',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      if (items.length === 0) {
        navigate('/cart');
      }
    }
  }, [isAuthenticated, isLoading, items.length, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Preparing checkout...</p>
      </div>
    );
  }

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name || !formData.email || !formData.address) {
      toast({
        title: 'Oops! 😅',
        description: 'Please fill in all required fields',
      });
      return;
    }

    const transactionUuid = uuidv4();
    const amount = totalPrice.toFixed(2);
    const pendingOrder = {
      items: orderItems,
      shipping: {
        ...shipping,
        name: formData.name,
        email: formData.email,
      },
      totalAmount: Number(amount),
      transactionUuid,
    };

    sessionStorage.setItem('pendingOrder', JSON.stringify(pendingOrder));

    setEsewaPayload({
      amount,
      taxAmount: '0',
      productServiceCharge: '0',
      productDeliveryCharge: '0',
      transactionUuid,
      productCode: 'EPAYTEST',
      successUrl: `${window.location.origin}/payment-success`,
      failureUrl: `${window.location.origin}/payment-failure`,
    });

    toast({
      title: 'Redirecting to eSewa',
      description: 'Please complete your payment to finalize the order.',
    });
  };

  if (esewaPayload) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-2xl font-semibold">Redirecting to eSewa…</h2>
        <p className="text-muted-foreground">
          You will be redirected shortly. If nothing happens, please ensure pop-ups are allowed and try again.
        </p>
        <EsewaForm {...esewaPayload} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-border bg-background shadow-sm">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold">Shipping Information</h2>
              </div>
              <div className="px-6 py-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      required
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium text-foreground">
                      Street Address *
                    </label>
                    <input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      required
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium text-foreground">
                        City *
                      </label>
                      <input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="New York"
                        required
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="zipCode" className="text-sm font-medium text-foreground">
                        ZIP Code *
                      </label>
                      <input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="10001"
                        required
                        className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-md bg-secondary px-4 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Place Order 🎉
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-xl border border-border bg-background shadow-sm">
              <div className="border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>
              <div className="px-6 py-6 space-y-4">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t border-border">
                  <p>✓ Secure checkout</p>
                  <p>✓ Free shipping included</p>
                  <p>✓ 30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
