// "use client";

// import { useEffect, useRef, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import axios from 'axios';
// import { Brain, RefreshCw } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';
// import { BASE_URL } from '../../../lib/Api';
// import { useAuth } from '@/app/context/AuthContext';

// // ─────────────────────────────────────────────────────────────
// // Route: /google/callback   ← must match GOOGLE_OAUTH_CALLBACK_URL
// //
// // Flow:
// //   1. Google redirects here with ?code=...
// //   2. We POST { code } to /api/v1/auth/google/
// //   3. Django exchanges code → returns { access, refresh } JWT tokens
// //   4. We fetch /auth/profile/ with the access token
// //   5. login(tokens, user) → /home
// // ─────────────────────────────────────────────────────────────

// function GoogleCallbackContent() {
//   const router       = useRouter();
//   const { login }    = useAuth();
//   const { toast }    = useToast();
//   const searchParams = useSearchParams();
//   const hasRun       = useRef(false); // guard against React strict-mode double-invoke

//   useEffect(() => {
//     if (hasRun.current) return;
//     hasRun.current = true;

//     const handleCallback = async () => {
//       const code  = searchParams.get('code');
//       const error = searchParams.get('error');

//       // User denied Google access
//       if (error || !code) {
//         toast({
//           title: 'Google sign-in cancelled',
//           description: error === 'access_denied'
//             ? 'You cancelled the Google sign-in.'
//             : 'No authorisation code received. Please try again.',
//           variant: 'destructive',
//         });
//         router.replace('/login');
//         return;
//       }

//       try {
//         // Step 1 — Exchange code for JWT tokens
//         const { data: tokenData } = await axios.post(
//           `${BASE_URL}/api/v1/auth/google/`,
//           { code },
//         );
//         // tokenData expected shape: { access, refresh }  OR  { token: { access, refresh } }
//         const access  = tokenData.access  ?? tokenData.token?.access;
//         const refresh = tokenData.refresh ?? tokenData.token?.refresh;

//         if (!access) throw new Error('No access token returned from server.');

//         // Step 2 — Fetch profile with the access token
//         const { data: profileData } = await axios.get(`${BASE_URL}/auth/profile/`, {
//           headers: { Authorization: `Bearer ${access}` },
//         });

//         // Step 3 — Persist session
//         login(
//           { access, refresh: refresh ?? '' },
//           {
//             id:         profileData.id,
//             name:       profileData.name,
//             email:      profileData.email,
//             gender:     profileData.gender,
//             role:       profileData.role,
//             created_at: profileData.created_at,
//           },
//         );

//         toast({
//           title: `Welcome, ${profileData.name}!`,
//           description: 'Signed in with Google successfully.',
//         });

//         router.replace('/home');

//       } catch (err: unknown) {
//         const msg = axios.isAxiosError(err)
//           ? (err.response?.data?.detail ?? err.response?.data?.error ?? 'Google sign-in failed.')
//           : 'Something went wrong. Please try again.';
//         toast({ title: 'Sign-in failed', description: msg, variant: 'destructive' });
//         router.replace('/login');
//       }
//     };

//     handleCallback();
//   }, []); // eslint-disable-line react-hooks/exhaustive-deps

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background">
//       <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in-95 duration-500 px-6">

//         {/* Logo */}
//         <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20">
//           <Brain className="h-7 w-7 text-primary" />
//         </div>

//         {/* Spinner ring */}
//         <div className="relative flex items-center justify-center w-14 h-14">
//           <div className="absolute inset-0 rounded-full border-2 border-primary/10" />
//           <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
//           <RefreshCw className="h-5 w-5 text-primary/60" />
//         </div>

//         <div className="space-y-1.5 max-w-xs">
//           <p className="text-base font-semibold text-foreground">Completing Google sign-in...</p>
//           <p className="text-sm text-muted-foreground">Please wait while we set up your session.</p>
//         </div>

//         {/* Animated progress bar */}
//         <div className="w-48 h-1 rounded-full bg-muted overflow-hidden">
//           <div
//             className="h-full bg-primary rounded-full animate-pulse"
//             style={{ width: '60%' }}
//           />
//         </div>

//       </div>
//     </div>
//   );
// }

// export default function GoogleCallbackPage() {
//   return (
//     <Suspense fallback={
//       <div className="min-h-screen flex items-center justify-center">
//         <RefreshCw className="h-6 w-6 animate-spin text-primary" />
//       </div>
//     }>
//       <GoogleCallbackContent />
//     </Suspense>
//   );
// }
"use client";

import { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Brain, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BASE_URL } from '../../../lib/Api';
import { useAuth } from '@/app/context/AuthContext';

// ─────────────────────────────────────────────────────────────
// Route: /google/callback
// File:  app/google/callback/page.tsx
//
// Flow:
//   1. Google redirects here with ?code=...
//   2. POST { code } → /api/v1/auth/google/   (Django exchanges for tokens)
//   3. GET  /auth/profile/  Bearer {access}
//   4. login(tokens, user)  → /home
// ─────────────────────────────────────────────────────────────

function GoogleCallbackContent() {
  const router       = useRouter();
  const { login }    = useAuth();
  const { toast }    = useToast();
  const searchParams = useSearchParams();
  const hasRun       = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      const code  = searchParams.get('code');
      const error = searchParams.get('error');

      if (error || !code) {
        toast({
          title: 'Google sign-in cancelled',
          description: error === 'access_denied'
            ? 'You cancelled the Google sign-in.'
            : 'No authorisation code received. Please try again.',
          variant: 'destructive',
        });
        router.replace('/login');
        return;
      }

      try {
        // Step 1 — Exchange code for JWT tokens via Django
        const { data: tokenData } = await axios.post(
          `${BASE_URL}/api/v1/auth/google/`,
          { code },
        );
        // Handle both response shapes: { access, refresh } or { token: { access, refresh } }
        const access  = tokenData.access  ?? tokenData.token?.access;
        const refresh = tokenData.refresh ?? tokenData.token?.refresh;

        if (!access) throw new Error('No access token returned from server.');

        // Step 2 — Fetch profile
        const { data: profileData } = await axios.get(`${BASE_URL}/auth/profile/`, {
          headers: { Authorization: `Bearer ${access}` },
        });

        // Step 3 — Persist session
        login(
          { access, refresh: refresh ?? '' },
          {
            id:         profileData.id,
            name:       profileData.name,
            email:      profileData.email,
            gender:     profileData.gender,
            role:       profileData.role,
            created_at: profileData.created_at,
          },
        );

        toast({
          title: `Welcome, ${profileData.name}!`,
          description: 'Signed in with Google successfully.',
        });
        router.replace('/home');

      } catch (err: unknown) {
        const msg = axios.isAxiosError(err)
          ? (err.response?.data?.detail ?? err.response?.data?.error ?? 'Google sign-in failed.')
          : 'Something went wrong. Please try again.';
        toast({ title: 'Sign-in failed', description: msg, variant: 'destructive' });
        router.replace('/login');
      }
    };

    handleCallback();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center animate-in fade-in zoom-in-95 duration-500 px-6">

        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20">
          <Brain className="h-7 w-7 text-primary" />
        </div>

        <div className="relative flex items-center justify-center w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-primary/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
          <RefreshCw className="h-5 w-5 text-primary/60" />
        </div>

        <div className="space-y-1.5 max-w-xs">
          <p className="text-base font-semibold text-foreground">Completing Google sign-in...</p>
          <p className="text-sm text-muted-foreground">Please wait while we set up your session.</p>
        </div>

        <div className="w-48 h-1 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
        </div>

      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}