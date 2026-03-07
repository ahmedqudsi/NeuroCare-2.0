"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Mail, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from "axios";
import { BASE_URL } from "../../lib/Api";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail]         = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState('');

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError('');
  //   setIsLoading(true);

  //   try {
  //     const res = await fetch('http://127.0.0.1:8000/auth/send-password-reset-email/', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email }),
  //     });
  //     const data = await res.json();

  //     if (!res.ok) {
  //       setError(data?.detail ?? 'No active account found with this email.');
  //       setIsLoading(false);
  //       return;
  //     }

  //     // data = { email, link }
  //     // link = "http://127.0.0.1:8000/auth/password-reset/{uid}/{token}"
  //     const url   = new URL(data.link);
  //     const parts = url.pathname.split('/').filter(Boolean);
  //     // parts → ['auth', 'password-reset', '{uid}', '{token}']
  //     const uid   = parts[2];
  //     const token = parts[3];
  //     router.push(`/reset-password/${uid}/${token}`);

  //   } catch {
  //     setError('Something went wrong. Please try again.');
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/auth/send-password-reset-email/`,
        {
          email,
        },
      );

      const data = res.data;

      // data = { email, link }
      // link = "http://127.0.0.1:8000/auth/password-reset/{uid}/{token}"

      const url = new URL(data.link);
      const parts = url.pathname.split("/").filter(Boolean);

      const uid = parts[2];
      const token = parts[3];

      router.push(`/reset-password/${uid}/${token}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.detail ??
          "No active account found with this email.",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-primary p-12 text-primary-foreground relative overflow-hidden shrink-0">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 border border-white/20">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-lg leading-none">NeuroCare</p>
            <p className="text-[11px] uppercase tracking-widest text-white/60 font-medium">Healthcare</p>
          </div>
        </div>
        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Account Recovery
          </div>
          <h2 className="text-4xl font-bold leading-tight">Regain access to your account securely</h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Enter your registered email. If an active account exists, we'll send a secure reset link instantly.
          </p>
          <div className="space-y-4 pt-2">
            {[
              { num: '1', title: 'Enter your email',  desc: 'We look up your registered account'          },
              { num: '2', title: 'Receive a link',     desc: 'A secure reset link is emailed to you'       },
              { num: '3', title: 'Set new password',   desc: 'Click the link and choose a strong password' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 border border-white/20 text-xs font-bold shrink-0 mt-0.5">{num}</div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-white/55">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex gap-8">
          {[{ value: 'Secure', label: 'Link' }, { value: '15 min', label: 'Expiry' }, { value: 'Safe', label: 'Process' }].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-white/60 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex lg:hidden items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">NeuroCare</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Healthcare</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Forgot your password?</h1>
              <p className="text-muted-foreground text-sm mt-1.5 leading-relaxed">
                Enter the email linked to your account and we'll send you a secure reset link.
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-in fade-in duration-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                disabled={isLoading} className="h-11 rounded-xl" required autoFocus />
            </div>
            <Button type="submit" className="w-full h-11 rounded-xl gap-2 font-semibold shadow-sm shadow-primary/20"
              disabled={isLoading || !email}>
              {isLoading
                ? <><RefreshCw className="h-4 w-4 animate-spin" /> Sending reset link...</>
                : <>Send Reset Link <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>

          <button onClick={() => router.push('/login')}
            className="flex items-center justify-center gap-1.5 w-full text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
}