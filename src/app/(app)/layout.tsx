
"use client";

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { CartProvider } from '@/context/CartContext';

export default function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('neuroCareUserLoggedIn') === 'true';
    const userEmail = localStorage.getItem('neuroCareUserEmail');

    if (!isLoggedIn || !userEmail) {
      router.replace('/login');
    }
  }, [router]);

  // Optionally, add a loading state here while checking auth
  // For now, it might show a flash of content before redirect if not logged in quickly

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </CartProvider>
  );
}
