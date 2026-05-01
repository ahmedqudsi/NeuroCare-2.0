// "use client";

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import { useRouter, useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import {
//   Brain, Eye, EyeOff, ArrowRight,
//   User, Stethoscope, HeartPulse, FlaskConical, Pill, Wrench, RefreshCw,
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useToast } from '@/hooks/use-toast';
// import { cn } from '@/lib/utils';
// import { BASE_URL } from '../../lib/Api';
// import { useAuth } from '@/app/context/AuthContext';

// // ─────────────────────────────────────────────────────────────
// // 1. POST /auth/login/        { email, password }
// //    response: { login, token: { access, refresh } }
// //
// // 2. GET  /auth/profile/      Authorization: Bearer {access}
// //    response: { id, name, email, gender?, role?, created_at }
// //
// // 3. login(tokens, user)  →  AuthContext + localStorage
// // 4. router.push('/home')
// // ─────────────────────────────────────────────────────────────

// const GoogleIcon = () => (
//   <svg viewBox="0 0 48 48" width="18" height="18">
//     <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
//     <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
//     <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
//     <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
//   </svg>
// );

// type Role = 'patient' | 'doctor' | 'nurse' | 'pharmacist' | 'lab_manager';

// const roles: { id: Role; label: string; icon: React.ElementType; live: boolean }[] = [
//   { id: 'patient',     label: 'Patient',    icon: User,         live: true  },
//   { id: 'doctor',      label: 'Doctor',      icon: Stethoscope,  live: false },
//   { id: 'nurse',       label: 'Nurse',       icon: HeartPulse,   live: false },
//   { id: 'pharmacist',  label: 'Pharmacist',  icon: Pill,         live: false },
//   { id: 'lab_manager', label: 'Lab Manager', icon: FlaskConical, live: false },
// ];

// export default function LoginPage() {
//   const router    = useRouter();
//   const { login } = useAuth();
//   const { toast } = useToast();
//   const searchParams = useSearchParams();
//   const [selectedRole, setSelectedRole] = useState<Role>('patient');
//   const [email, setEmail]               = useState('');
//   const [password, setPassword]         = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading]       = useState(false);

//   const activeRole = roles.find(r => r.id === selectedRole)!;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!activeRole.live) return;
//     setIsLoading(true);

//     try {
//       // Step 1 — Login
//       const { data: loginData } = await axios.post(`${BASE_URL}/auth/login/`, {
//         email,
//         password,
//       });
//       // loginData = { login: true, token: { access, refresh } }
//       const { access, refresh } = loginData.token;

//       // Step 2 — Fetch profile with the access token
//       const { data: profileData } = await axios.get(`${BASE_URL}/auth/profile/`, {
//         headers: { Authorization: `Bearer ${access}` },
//       });
//       // profileData = { id, name, email, gender?, role? }
//       login(
//         { access, refresh },
//         {
//           id:     profileData.id,
//           name:   profileData.name,
//           email:  profileData.email,
//           gender: profileData.gender,
//           role:   profileData.role,
//           created_at: profileData.created_at,
//         },
//       );

//       toast({ title: `Welcome back, ${profileData.name}!`, description: 'You have been signed in.' });
//       router.push('/home');

//     } catch (err: unknown) {
//       const msg = axios.isAxiosError(err)
//         ? (err.response?.data?.detail ?? err.response?.data?.non_field_errors?.[0] ?? 'Invalid email or password.')
//         : 'Something went wrong.';
//       toast({ title: 'Sign in failed', description: msg, variant: 'destructive' });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleLogin = () => {
//     toast({ title: 'Coming soon', description: 'Google login is not yet available.' });
//   };
//   useEffect(() => {
//     const redirected = searchParams.get("redirected");
//     const from = searchParams.get("from");

//     if (redirected === "true") {
//       toast({
//         title: "Login required",
//         description: `Please sign in to access ${from ?? "this page"}.`,
//         variant: "destructive",
//       });
//     }
//   }, [searchParams, toast]);

//   return (
//     <div className="min-h-screen flex">

//       <div className="hidden lg:flex flex-col justify-between w-[42%] bg-primary p-12 text-primary-foreground relative overflow-hidden shrink-0">
//         <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
//         <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-white/5" />
//         <div className="absolute top-1/2 right-8 w-48 h-48 rounded-full bg-white/5" />

//         <div className="relative flex items-center gap-3">
//           <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15 border border-white/20">
//             <Brain className="h-6 w-6" />
//           </div>
//           <div>
//             <p className="font-bold text-lg leading-none">NeuroCare</p>
//             <p className="text-[11px] uppercase tracking-widest text-white/60 font-medium">Healthcare</p>
//           </div>
//         </div>

//         <div className="relative space-y-5">
//           <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest">
//             <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
//             Stroke Recovery Platform
//           </div>
//           <h2 className="text-4xl font-bold leading-tight">
//             Your trusted companion in brain stroke recovery
//           </h2>
//           <p className="text-white/70 text-base leading-relaxed max-w-sm">
//             Connecting patients, caregivers, and healthcare professionals on one unified platform.
//           </p>
//         </div>

//         <div className="relative flex gap-8">
//           {[{ value: '15M+', label: 'Stroke patients' }, { value: '80%', label: 'Preventable' }, { value: '24/7', label: 'Support' }]
//             .map(({ value, label }) => (
//               <div key={label}>
//                 <p className="text-2xl font-bold">{value}</p>
//                 <p className="text-xs text-white/60 font-medium mt-0.5">{label}</p>
//               </div>
//             ))}
//         </div>
//       </div>

//       {/* ── Right form panel ── */}
//       <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background overflow-y-auto">
//         <div className="w-full max-w-md space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-700">

//           {/* Mobile logo */}
//           <div className="flex lg:hidden items-center gap-2.5">
//             <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20">
//               <Brain className="h-5 w-5 text-primary" />
//             </div>
//             <div>
//               <p className="font-bold text-sm">NeuroCare</p>
//               <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Healthcare</p>
//             </div>
//           </div>

//           <div>
//             <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
//             <p className="text-muted-foreground mt-1 text-sm">Select your role to sign in</p>
//           </div>

//           {/* Role selector */}
//           <div className="grid grid-cols-5 gap-2">
//             {roles.map(({ id, label, icon: Icon, live }) => (
//               <button key={id} type="button" onClick={() => setSelectedRole(id)}
//                 className={cn(
//                   'relative flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all duration-200',
//                   selectedRole === id
//                     ? 'border-primary bg-primary/8 text-primary'
//                     : 'border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground hover:bg-muted/50',
//                 )}
//               >
//                 <Icon className="h-4 w-4" />
//                 <span className="text-[10px] font-semibold leading-tight">{label}</span>
//                 {!live && (
//                   <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 border border-background">
//                     <Wrench className="h-2 w-2 text-white" />
//                   </span>
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* Under-dev notice */}
//           {!activeRole.live && (
//             <div className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 px-4 py-4 animate-in fade-in duration-300">
//               <div className="flex items-start gap-3">
//                 <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 shrink-0">
//                   <Wrench className="h-4 w-4 text-amber-500" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
//                     {activeRole.label} portal — Under Development
//                   </p>
//                   <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
//                     The {activeRole.label.toLowerCase()} login portal is being built. Preview only.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Google — patients only */}
//           {selectedRole === 'patient' && (
//             <>
//               <button onClick={handleGoogleLogin} disabled={isLoading}
//                 className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-border bg-card hover:bg-muted transition-all duration-200 text-sm font-medium shadow-sm active:scale-[0.98] disabled:opacity-60">
//                 <GoogleIcon />
//                 Continue with Google
//               </button>
//               <div className="flex items-center gap-4">
//                 <div className="flex-1 h-px bg-border" />
//                 <span className="text-xs text-muted-foreground">or with email</span>
//                 <div className="flex-1 h-px bg-border" />
//               </div>
//             </>
//           )}

//           {/* Form */}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
//               <Input id="email" type="email" placeholder="you@example.com"
//                 value={email} onChange={e => setEmail(e.target.value)}
//                 disabled={isLoading || !activeRole.live}
//                 className="h-11 rounded-xl" required={activeRole.live} />
//             </div>

//             <div className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <Label htmlFor="password" className="text-sm font-medium">Password</Label>
//                 {activeRole.live && (
//                   <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
//                     Forgot password?
//                   </Link>
//                 )}
//               </div>
//               <div className="relative">
//                 <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Password"
//                   value={password} onChange={e => setPassword(e.target.value)}
//                   disabled={isLoading || !activeRole.live}
//                   className="h-11 rounded-xl pr-11" required={activeRole.live} />
//                 <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
//                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                 </button>
//               </div>
//             </div>

//             <Button type="submit"
//               className={cn(
//                 'w-full h-11 rounded-xl gap-2 font-semibold transition-all duration-200',
//                 activeRole.live ? 'shadow-sm shadow-primary/20 hover:shadow-primary/30' : 'opacity-60 cursor-not-allowed',
//               )}
//               disabled={isLoading || !activeRole.live}>
//               {isLoading
//                 ? <><RefreshCw className="h-4 w-4 animate-spin" /> Signing in...</>
//                 : activeRole.live
//                   ? <>Sign In <ArrowRight className="h-4 w-4" /></>
//                   : <><Wrench className="h-4 w-4" /> Coming Soon</>
//               }
//             </Button>
//           </form>

//           <p className="text-center text-sm text-muted-foreground">
//             Don&apos;t have an account?{' '}
//             <Link href="/signup" className="font-semibold text-primary hover:underline">Create one</Link>
//           </p>

//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import {
  Brain, Eye, EyeOff, ArrowRight,
  User, Stethoscope, HeartPulse, FlaskConical, Pill, Wrench, RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { BASE_URL } from '../../lib/Api';
import { useAuth } from '@/app/context/AuthContext';

// ─────────────────────────────────────────────────────────────
// Google OAuth — callback URL is read from .env so it works
// in both local dev and production without any code changes.
//
// .env.local      → NEXT_PUBLIC_APP_URL=http://localhost:9002
// .env.production → NEXT_PUBLIC_APP_URL=https://neuro-care20.vercel.app
//
// The callback path is always /google/callback
// ─────────────────────────────────────────────────────────────

const GOOGLE_CLIENT_ID   = '181230774192-l2j93v43hahn143as61bm1g7teb4qn06.apps.googleusercontent.com';
const APP_URL            = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:9002';
// const GOOGLE_CALLBACK_URL = `${APP_URL}/google/callback`;
const GOOGLE_CALLBACK_URL = `http://localhost:9002/google/callback`;

function buildGoogleOAuthUrl(): string {
  const params = new URLSearchParams({
    client_id:     GOOGLE_CLIENT_ID,
    redirect_uri:  GOOGLE_CALLBACK_URL,
    response_type: 'code',
    scope:         'openid email profile',
    access_type:   'offline',
    prompt:        'select_account',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="18" height="18">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

type Role = 'patient' | 'doctor' | 'nurse' | 'pharmacist' | 'lab_manager';

const roles: { id: Role; label: string; icon: React.ElementType; live: boolean }[] = [
  { id: 'patient',     label: 'Patient',    icon: User,         live: true  },
  { id: 'doctor',      label: 'Doctor',      icon: Stethoscope,  live: false },
  { id: 'nurse',       label: 'Nurse',       icon: HeartPulse,   live: false },
  { id: 'pharmacist',  label: 'Pharmacist',  icon: Pill,         live: false },
  { id: 'lab_manager', label: 'Lab Manager', icon: FlaskConical, live: false },
];

export default function LoginPage() {
  const router       = useRouter();
  const { login }    = useAuth();
  const { toast }    = useToast();
  const searchParams = useSearchParams();

  const [selectedRole, setSelectedRole]   = useState<Role>('patient');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [isLoading, setIsLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const activeRole = roles.find(r => r.id === selectedRole)!;

  useEffect(() => {
    const redirected = searchParams.get('redirected');
    const from       = searchParams.get('from');
    if (redirected === 'true') {
      toast({
        title: 'Login required',
        description: `Please sign in to access ${from ?? 'this page'}.`,
        variant: 'destructive',
      });
    }
  }, [searchParams, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRole.live) return;
    setIsLoading(true);
    try {
      const { data: loginData } = await axios.post(`${BASE_URL}/auth/login/`, { email, password });
      const { access, refresh } = loginData.token;

      const { data: profileData } = await axios.get(`${BASE_URL}/auth/profile/`, {
        headers: { Authorization: `Bearer ${access}` },
      });

      login(
        { access, refresh },
        {
          id:         profileData.id,
          name:       profileData.name,
          email:      profileData.email,
          gender:     profileData.gender,
          role:       profileData.role,
          created_at: profileData.created_at,
        },
      );
      toast({ title: `Welcome back, ${profileData.name}!`, description: 'You have been signed in.' });
      router.push('/home');
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data?.detail ?? err.response?.data?.non_field_errors?.[0] ?? 'Invalid email or password.')
        : 'Something went wrong.';
      toast({ title: 'Sign in failed', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleLogin = () => {
  //   setGoogleLoading(true);
  //   window.location.href = buildGoogleOAuthUrl();
  // };
  const handleGoogleLogin = () => {
  setGoogleLoading(true);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
     redirect_uri: "http://localhost:8000/api/v1/auth/google/callback/",
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  window.location.href =
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
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
            Stroke Recovery Platform
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            Your trusted companion in brain stroke recovery
          </h2>
          <p className="text-white/70 text-base leading-relaxed max-w-sm">
            Connecting patients, caregivers, and healthcare professionals on one unified platform.
          </p>
        </div>

        <div className="relative flex gap-8">
          {[{ value: '15M+', label: 'Stroke patients' }, { value: '80%', label: 'Preventable' }, { value: '24/7', label: 'Support' }]
            .map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-white/60 font-medium mt-0.5">{label}</p>
              </div>
            ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background overflow-y-auto">
        <div className="w-full max-w-md space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-700">

          <div className="flex lg:hidden items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10 border border-primary/20">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">NeuroCare</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Healthcare</p>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-1 text-sm">Select your role to sign in</p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {roles.map(({ id, label, icon: Icon, live }) => (
              <button key={id} type="button" onClick={() => setSelectedRole(id)}
                className={cn(
                  'relative flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all duration-200',
                  selectedRole === id
                    ? 'border-primary bg-primary/8 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground hover:bg-muted/50',
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="text-[10px] font-semibold leading-tight">{label}</span>
                {!live && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 border border-background">
                    <Wrench className="h-2 w-2 text-white" />
                  </span>
                )}
              </button>
            ))}
          </div>

          {!activeRole.live && (
            <div className="rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 px-4 py-4 animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 shrink-0">
                  <Wrench className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {activeRole.label} portal — Under Development
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    The {activeRole.label.toLowerCase()} login portal is being built. Preview only.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedRole === 'patient' && (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading || googleLoading}
                className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border border-border bg-card hover:bg-muted transition-all duration-200 text-sm font-medium shadow-sm active:scale-[0.98] disabled:opacity-60"
              >
                {googleLoading
                  ? <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                  : <GoogleIcon />
                }
                {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
              </button>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">or with email</span>
                <div className="flex-1 h-px bg-border" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input id="email" type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                disabled={isLoading || !activeRole.live}
                className="h-11 rounded-xl" required={activeRole.live} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                {activeRole.live && (
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  disabled={isLoading || !activeRole.live}
                  className="h-11 rounded-xl pr-11" required={activeRole.live} />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit"
              className={cn(
                'w-full h-11 rounded-xl gap-2 font-semibold transition-all duration-200',
                activeRole.live ? 'shadow-sm shadow-primary/20 hover:shadow-primary/30' : 'opacity-60 cursor-not-allowed',
              )}
              disabled={isLoading || !activeRole.live}>
              {isLoading
                ? <><RefreshCw className="h-4 w-4 animate-spin" /> Signing in...</>
                : activeRole.live
                  ? <>Sign In <ArrowRight className="h-4 w-4" /></>
                  : <><Wrench className="h-4 w-4" /> Coming Soon</>
              }
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">Create one</Link>
          </p>

        </div>
      </div>
    </div>
  );
}