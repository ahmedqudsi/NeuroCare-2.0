// "use client";

// import { useState, useRef, useEffect, Suspense } from "react";
// import { useRouter, useParams } from "next/navigation";
// import {
//   Brain,
//   Mail,
//   ArrowRight,
//   CheckCircle2,
//   RefreshCw,
//   ArrowLeft,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { cn } from "@/lib/utils";

// // Route:  /verify/[encodedEmail]
// // Param:  encodedEmail = btoa(email)
// // API:    POST /auth/verify-otp/{encodedEmail}/  body: { otp: number }
// // On success redirect to /login

// function VerifyOtpContent() {
//   const router = useRouter();
//   const params = useParams();
//   const { toast } = useToast();

//   const encodedEmail = (params?.encodedEmail as string) ?? "";
//   const decodedEmail = (() => {
//     try {
//       return atob(encodedEmail);
//     } catch {
//       return encodedEmail;
//     }
//   })();

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [resendCooldown, setResendCooldown] = useState(30);
//   const [error, setError] = useState("");
//   const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const isOtpComplete = otp.every((d) => d !== "");

//   // kick off 30s cooldown the moment the page mounts
//   useEffect(() => {
//     startCooldown();
//   }, []);

//   const startCooldown = () => {
//     setResendCooldown(30);
//     const t = setInterval(() => {
//       setResendCooldown((prev) => {
//         if (prev <= 1) {
//           clearInterval(t);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const handleChange = (index: number, value: string) => {
//     if (!/^\d*$/.test(value)) return;
//     const next = [...otp];
//     next[index] = value.slice(-1);
//     setOtp(next);
//     if (value && index < 5) otpRefs.current[index + 1]?.focus();
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0)
//       otpRefs.current[index - 1]?.focus();
//   };

//   const handlePaste = (e: React.ClipboardEvent) => {
//     const digits = e.clipboardData
//       .getData("text")
//       .replace(/\D/g, "")
//       .slice(0, 6);
//     if (digits.length === 6) {
//       setOtp(digits.split(""));
//       otpRefs.current[5]?.focus();
//     }
//   };

//   const handleResend = () => {
//     if (resendCooldown > 0) return;
//     // TODO: call resend OTP endpoint
//     // await fetch('http://127.0.0.1:8000/auth/resend-otp/', { ... })
//     startCooldown();
//     toast({
//       title: "Code resent",
//       description: `A new code was sent to ${decodedEmail}`,
//     });
//   };

//   const handleVerify = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!isOtpComplete) return;
//     setError("");
//     setIsLoading(true);

//     // TODO: replace with real API call
//     // const res = await fetch(`http://127.0.0.1:8000/auth/verify-otp/${encodedEmail}/`, {
//     //   method: 'POST',
//     //   headers: { 'Content-Type': 'application/json' },
//     //   body: JSON.stringify({ otp: Number(otp.join('')) }),
//     // });
//     // const data = await res.json();
//     // if (!res.ok) {
//     //   setError(data?.detail ?? 'Invalid or expired code. Please try again.');
//     //   setIsLoading(false);
//     //   return;
//     // }

//     await new Promise((r) => setTimeout(r, 1200)); // remove when real API is wired
//     setIsLoading(false);
//     toast({
//       title: "Email verified!",
//       description: "Your account is active. Please sign in.",
//     });
//     router.push("/login");
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* ── Left branding panel ── */}
//       <div className="hidden lg:flex flex-col justify-between w-[42%] bg-primary p-12 text-primary-foreground relative overflow-hidden shrink-0">
//         <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
//         <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-white/5" />
//         <div className="absolute top-1/2 right-8 w-48 h-48 rounded-full bg-white/5" />

//         {/* Logo */}
//         <div className="relative flex items-center gap-3">
//           <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 border border-white/20">
//             <Brain className="h-6 w-6" />
//           </div>
//           <div>
//             <p className="font-bold text-lg leading-none">NeuroCare</p>
//             <p className="text-[11px] uppercase tracking-widest text-white/60 font-medium">
//               Healthcare
//             </p>
//           </div>
//         </div>

//         {/* Center content */}
//         <div className="relative space-y-5">
//           <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest">
//             <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
//             Email Verification
//           </div>
//           <h2 className="text-4xl font-bold leading-tight">
//             One last step to activate your account
//           </h2>
//           <p className="text-white/70 text-sm leading-relaxed max-w-sm">
//             Enter the 6-digit code we sent to your inbox to confirm your
//             identity and complete registration.
//           </p>

//           {/* Step list */}
//           <div className="space-y-4 pt-2">
//             {[
//               {
//                 num: "1",
//                 title: "Check your inbox",
//                 desc: `Email sent to ${decodedEmail}`,
//               },
//               {
//                 num: "2",
//                 title: "Enter the 6-digit code",
//                 desc: "Type the code exactly as received",
//               },
//               {
//                 num: "3",
//                 title: "Account activated",
//                 desc: "Sign in and start your journey",
//               },
//             ].map(({ num, title, desc }) => (
//               <div key={num} className="flex items-start gap-3">
//                 <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 border border-white/20 text-xs font-bold shrink-0 mt-0.5">
//                   {num}
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold">{title}</p>
//                   <p className="text-xs text-white/55">{desc}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Bottom stats */}
//         <div className="relative flex gap-8">
//           {[
//             { value: "6-digit", label: "Code" },
//             { value: "Secure", label: "Verified" },
//             { value: "10 min", label: "Expiry" },
//           ].map(({ value, label }) => (
//             <div key={label}>
//               <p className="text-2xl font-bold">{value}</p>
//               <p className="text-xs text-white/60 font-medium mt-0.5">
//                 {label}
//               </p>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Right OTP form ── */}
//       <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
//         <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
//           {/* Mobile logo */}
//           <div className="flex lg:hidden items-center gap-2.5">
//             <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20">
//               <Brain className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <p className="font-bold text-sm">NeuroCare</p>
//               <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
//                 Healthcare
//               </p>
//             </div>
//           </div>

//           {/* Header */}
//           <div className="flex flex-col items-center text-center gap-4">
//             <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
//               <Mail className="h-8 w-8 text-primary" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight">
//                 Check your email
//               </h1>
//               <p className="text-muted-foreground text-sm mt-1.5 max-w-xs leading-relaxed">
//                 We sent a 6-digit verification code to{" "}
//                 <span className="font-semibold text-foreground break-all">
//                   {decodedEmail}
//                 </span>
//               </p>
//             </div>
//           </div>

//           {/* Error banner */}
//           {error && (
//             <div className="rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive text-center animate-in fade-in duration-200">
//               {error}
//             </div>
//           )}

//           {/* OTP form */}
//           <form onSubmit={handleVerify} className="space-y-6">
//             <div>
//               <Label className="text-sm font-medium block text-center mb-4">
//                 Verification Code
//               </Label>

//               {/* 6 digit boxes */}
//               <div
//                 className="flex items-center justify-center gap-3"
//                 onPaste={handlePaste}
//               >
//                 {otp.map((digit, index) => (
//                   <input
//                     key={index}
//                     ref={(el) => {
//                       otpRefs.current[index] = el;
//                     }}
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={1}
//                     value={digit}
//                     onChange={(e) => handleChange(index, e.target.value)}
//                     onKeyDown={(e) => handleKeyDown(index, e)}
//                     autoFocus={index === 0}
//                     className={cn(
//                       "w-12 h-14 text-center text-xl font-bold rounded-xl border bg-card",
//                       "transition-all duration-150 outline-none",
//                       "focus:border-primary focus:ring-2 focus:ring-primary/20",
//                       digit
//                         ? "border-primary bg-primary/5 text-primary"
//                         : "border-border text-foreground",
//                     )}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Verify button */}
//             <Button
//               type="submit"
//               className="w-full h-11 rounded-xl gap-2 font-semibold shadow-sm shadow-primary/20"
//               disabled={isLoading || !isOtpComplete}
//             >
//               {isLoading ? (
//                 <>
//                   <RefreshCw className="h-4 w-4 animate-spin" /> Verifying...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle2 className="h-4 w-4" /> Verify &amp; Activate
//                   Account <ArrowRight className="h-4 w-4" />
//                 </>
//               )}
//             </Button>

//             {/* Resend */}
//             <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
//               <span>Didn&apos;t receive it?</span>
//               <button
//                 type="button"
//                 onClick={handleResend}
//                 disabled={resendCooldown > 0}
//                 className={cn(
//                   "flex items-center gap-1 font-semibold transition-colors",
//                   resendCooldown > 0
//                     ? "text-muted-foreground cursor-not-allowed"
//                     : "text-primary hover:underline",
//                 )}
//               >
//                 <RefreshCw
//                   className={cn(
//                     "h-3.5 w-3.5",
//                     resendCooldown > 0 && "animate-spin",
//                   )}
//                 />
//                 {resendCooldown > 0
//                   ? `Resend in ${resendCooldown}s`
//                   : "Resend code"}
//               </button>
//             </div>
//           </form>

//           {/* Back link */}
//           <button
//             onClick={() => router.push("/signup")}
//             className="flex items-center justify-center gap-1.5 w-full text-sm text-muted-foreground hover:text-primary transition-colors"
//           >
//             <ArrowLeft className="h-3.5 w-3.5" /> Back to sign up
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function VerifyOtpPage() {
//   return (
//     <Suspense
//       fallback={
//         <div className="flex items-center justify-center min-h-screen">
//           <RefreshCw className="h-6 w-6 animate-spin text-primary" />
//         </div>
//       }
//     >
//       <VerifyOtpContent />
//     </Suspense>
//   );
// }
"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import {
  Brain, Mail, ArrowRight, CheckCircle2, RefreshCw, ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BASE_URL } from '../../../lib/Api';

function VerifyOtpContent() {
  const router    = useRouter();
  const params    = useParams();
  const { toast } = useToast();

  const encodedEmail = (params?.encodedEmail as string) ?? '';

  // Decode for display only — the encoded form goes in the URL
  const decodedEmail = (() => {
    try { return atob(encodedEmail); }
    catch { return encodedEmail; }
  })();

  const [otp, setOtp]                       = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading]           = useState(false);
  const [isResending, setIsResending]       = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const otpRefs       = useRef<(HTMLInputElement | null)[]>([]);
  const isOtpComplete = otp.every(d => d !== '');

  // 30s cooldown on mount — OTP was sent during registration
  useEffect(() => { startCooldown(); }, []);

  const startCooldown = () => {
    setResendCooldown(30);
    const t = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(t); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (digits.length === 6) {
      setOtp(digits.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    setIsResending(true);

    try {
      await axios.post(`${BASE_URL}/auth/resend-otp/${encodedEmail}/`);
      toast({ title: 'Code resent', description: `A new OTP was sent to ${decodedEmail}` });
      startCooldown();
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.detail ?? 'Failed to resend code.')
        : 'Something went wrong.';
      toast({ title: 'Resend failed', description: msg, variant: 'destructive' });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpComplete) return;
    setIsLoading(true);

    try {
      await axios.post(`${BASE_URL}/auth/verify-otp/${encodedEmail}/`, {
        otp: Number(otp.join('')),
      });

      toast({ title: 'Email verified!', description: 'Your account is active. Please sign in.' });
      router.push('/login');

    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.detail ?? err.response?.data?.otp?.[0] ?? 'Invalid or expired code.')
        : 'Something went wrong.';
      toast({ title: 'Verification failed', description: msg, variant: 'destructive' });
      // Clear boxes so user can retry cleanly
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left branding panel ── */}
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
            Email Verification
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            One last step to activate your account
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Enter the 6-digit code we sent to your inbox to confirm your identity and complete registration.
          </p>
          <div className="space-y-4 pt-2">
            {[
              { num: '1', title: 'Check your inbox',       desc: `Email sent to ${decodedEmail}` },
              { num: '2', title: 'Enter the 6-digit code', desc: 'Type the code exactly as received' },
              { num: '3', title: 'Account activated',      desc: 'Sign in and start your journey' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/15 border border-white/20 text-xs font-bold shrink-0 mt-0.5">
                  {num}
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-white/55">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex gap-8">
          {[{ value: '6-digit', label: 'Code' }, { value: 'Secure', label: 'Verified' }, { value: '10 min', label: 'Expiry' }]
            .map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-white/60 font-medium mt-0.5">{label}</p>
              </div>
            ))}
        </div>
      </div>

      {/* ── Right OTP form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">NeuroCare</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Healthcare</p>
            </div>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
              <p className="text-muted-foreground text-sm mt-1.5 max-w-xs leading-relaxed">
                We sent a 6-digit code to{' '}
                <span className="font-semibold text-foreground break-all">{decodedEmail}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <Label className="text-sm font-medium block text-center mb-4">Verification Code</Label>
              <div className="flex items-center justify-center gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input key={index}
                    ref={el => { otpRefs.current[index] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    autoFocus={index === 0}
                    disabled={isLoading}
                    className={cn(
                      'w-12 h-14 text-center text-xl font-bold rounded-xl border bg-card',
                      'transition-all duration-150 outline-none disabled:opacity-50',
                      'focus:border-primary focus:ring-2 focus:ring-primary/20',
                      digit ? 'border-primary bg-primary/5 text-primary' : 'border-border text-foreground',
                    )}
                  />
                ))}
              </div>
            </div>

            <Button type="submit"
              className="w-full h-11 rounded-xl gap-2 font-semibold shadow-sm shadow-primary/20"
              disabled={isLoading || !isOtpComplete}>
              {isLoading
                ? <><RefreshCw className="h-4 w-4 animate-spin" /> Verifying...</>
                : <><CheckCircle2 className="h-4 w-4" /> Verify &amp; Activate Account <ArrowRight className="h-4 w-4" /></>
              }
            </Button>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Didn&apos;t receive it?</span>
              <button type="button" onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                className={cn(
                  'flex items-center gap-1 font-semibold transition-colors',
                  resendCooldown > 0 || isResending
                    ? 'text-muted-foreground cursor-not-allowed'
                    : 'text-primary hover:underline',
                )}>
                <RefreshCw className={cn('h-3.5 w-3.5', (resendCooldown > 0 || isResending) && 'animate-spin')} />
                {isResending ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
              </button>
            </div>
          </form>

          <button onClick={() => router.push('/signup')}
            className="flex items-center justify-center gap-1.5 w-full text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to sign up
          </button>

        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}