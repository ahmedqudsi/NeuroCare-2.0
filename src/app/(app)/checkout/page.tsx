
"use client";

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ShippingAddressForm } from '@/components/features/checkout/ShippingAddressForm';
import { PaymentDetailsForm } from '@/components/features/checkout/PaymentDetailsForm';
import confetti from 'canvas-confetti';
// Removed import for generateOrderConfirmationEmail

const checkoutFormSchema = z.object({
  // Shipping Details
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  streetAddress: z.string().min(5, { message: "Street address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().min(2, { message: "State is required." }),
  pincode: z.string().regex(/^\d{6}$/, { message: "Pincode must be 6 digits." }),
  contactNumber: z.string().regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit Indian mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),

  // Payment Details
  cardholderName: z.string().min(3, { message: "Cardholder name must be at least 3 characters." }),
  cardNumber: z.string()
    .min(15, { message: "Card number must be 15 or 16 digits."})
    .max(16, { message: "Card number must be 15 or 16 digits."})
    .regex(/^\d+$/, { message: "Card number must contain only digits." }), // Validates raw digits
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Enter expiry date in MM/YY format (e.g., 08/25)." }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits." }),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface StoredOrder {
  orderId: string;
  items: { name: string; quantity: number; }[];
  total: string;
  shippingAddress: {
    fullName: string;
    streetAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
  status: "Processing" | "Out for Delivery" | "Delivered" | "Cancelled";
  timestamp: string;
}

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      pincode: "",
      contactNumber: "",
      email: "",
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  useEffect(() => {
    if (cartItems.length === 0 && !isSubmitting && !paymentComplete) {
      router.push('/healthcare-services/pharma-delivery');
    }
  }, [cartItems, router, isSubmitting, paymentComplete]);

  useEffect(() => {
    if (paymentComplete && !paymentProcessing) {
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

      return () => clearInterval(interval);
    }
  }, [paymentComplete, paymentProcessing]);


  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
  };

  async function onSubmit(data: CheckoutFormValues) {
    setIsSubmitting(true);
    setPaymentProcessing(true);
    setPaymentComplete(false);
    setShowPaymentModal(true);

    await new Promise(resolve => setTimeout(resolve, 3000)); 

    setPaymentProcessing(false);
    setPaymentComplete(true);
    
    toast({
      title: "Order Placed Successfully!",
      description: (
        <div>
          <p>Thank you, {data.fullName}! Your order has been received.</p>
          <p>You can track your order status in the 'Track My Order' section.</p>
        </div>
      ),
      duration: 7000,
    });

    const mockOrderId = `NC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const newOrderData: StoredOrder = {
      orderId: mockOrderId,
      items: cartItems.map(item => ({ name: item.product.productName, quantity: item.quantity })),
      total: calculateTotal(),
      shippingAddress: {
        fullName: data.fullName,
        streetAddress: data.streetAddress,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
      },
      status: "Processing",
      timestamp: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      let existingOrders: StoredOrder[] = [];
      const storedOrdersData = localStorage.getItem('neuroCareOrders');
      if (storedOrdersData) {
        try {
          existingOrders = JSON.parse(storedOrdersData);
          if (!Array.isArray(existingOrders)) existingOrders = [];
        } catch (e) {
          console.error("Error parsing existing orders from localStorage", e);
          existingOrders = []; 
        }
      }
      
      if (existingOrders.length > 0 && existingOrders[0].status === "Processing") {
        existingOrders[0].status = "Out for Delivery"; 
      }
      
      const updatedOrders = [newOrderData, ...existingOrders];
      localStorage.setItem('neuroCareOrders', JSON.stringify(updatedOrders));

      // Removed call to generateOrderConfirmationEmail
    }

    await new Promise(resolve => setTimeout(resolve, 2000)); 

    setShowPaymentModal(false);
    clearCart();
    form.reset();
    setIsSubmitting(false);
    router.push('/order-status'); 
  }

  if (cartItems.length === 0 && !isSubmitting && !paymentComplete) {
    return <p className="text-center py-10">Your cart is empty. Redirecting...</p>;
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/cart">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ShippingAddressForm />
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-1 space-y-8">
              <Card className="shadow-lg sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-medium">{item.product.productName}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p>₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <p>Total:</p>
                    <p>₹{calculateTotal()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="pb-2 pt-6">
                    <CardTitle className="text-xl flex items-center">
                        <ShieldCheck className="mr-2 h-5 w-5 text-primary" />
                        Payment Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                  <PaymentDetailsForm />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button type="submit" size="lg" className="w-full max-w-md" disabled={isSubmitting || showPaymentModal}>
              <CreditCard className="mr-2 h-4 w-4" />
              {isSubmitting ? "Processing..." : "Place Order & Proceed to Payment"}
            </Button>
          </div>
        </form>
      </Form>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className={`w-64 h-48 shadow-2xl transform transition-all duration-300 ease-out ${paymentComplete ? 'scale-110' : 'scale-100'}`}>
            <CardContent className="flex flex-col items-center justify-center h-full space-y-4">
              {paymentProcessing && (
                <>
                  <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  <p className="text-muted-foreground">Processing Payment...</p>
                </>
              )}
              {paymentComplete && (
                <div className="flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-50 duration-500">
                  <CheckCircle2 className="h-20 w-20 text-green-500 mb-2 animate-bounce" />
                  <p className="text-green-600 font-semibold text-lg">Payment Successful!</p>
                  <p className="text-xs text-muted-foreground">Your order is confirmed.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

    