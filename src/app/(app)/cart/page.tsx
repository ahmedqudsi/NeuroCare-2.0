
"use client";

import { useCart } from '@/context/CartContext';
import type { PharmacyProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({});

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities({ ...quantities, [productId]: quantity });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
    setQuantities({ ...quantities, [productId]: quantity });
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/healthcare-services/pharma-delivery">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Medicine Catalog
          </Link>
        </Button>
      </div>
      <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cartItems.map((item) => (
              <Card key={item.product.id} className="shadow-md">
                <CardHeader>
                  <CardTitle>{item.product.productName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.product.description}</CardDescription>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-lg font-semibold">₹{item.product.price.toFixed(2)}</p>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        className="w-20 text-center mx-2"
                        value={quantities[item.product.id] !== undefined ? quantities[item.product.id] : item.quantity}
                        onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                        onBlur={(e) => handleUpdateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                        min="1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="ml-2"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Total: ₹{calculateTotal().toFixed(2)}</h2>
            <div className="flex items-center gap-2">
              <Button asChild variant="default">
                <Link href="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
              <Button variant="destructive" onClick={clearCart}>Clear Cart</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
