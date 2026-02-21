
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Brain, LogIn, Github, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const loginFormSchema = z.object({
  identifier: z.string().min(1, { message: "Username or Email ID is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" width="20" height="20" className="mr-2">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
    <path fill="none" d="M0 0h48v48H0z"></path>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 21 21" className="mr-2">
    <path fill="#f25022" d="M1 1h9v9H1z"/>
    <path fill="#00a4ef" d="M1 11h9v9H1z"/>
    <path fill="#7fba00" d="M11 1h9v9h-9z"/>
    <path fill="#ffb900" d="M11 11h9v9h-9z"/>
  </svg>
);

type SocialProvider = 'Google' | 'GitHub' | 'Microsoft';

interface StoredUser {
  username: string;
  email: string;
  password?: string;
  fullName?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeSocialProvider, setActiveSocialProvider] = useState<SocialProvider | null>(null);
  const [socialEmail, setSocialEmail] = useState('');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  useEffect(() => {
    if (localStorage.getItem('neuroCareUserLoggedIn') === 'true' && localStorage.getItem('neuroCareUserIdentifier')) {
        router.replace('/dashboard');
        return;
    }
    const storedIdentifier = localStorage.getItem('neuroCareUserIdentifier');
    if (storedIdentifier && !activeSocialProvider) {
      form.setValue('identifier', storedIdentifier);
    }
  }, [form, router, activeSocialProvider]);

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    let signedUpUsers: StoredUser[] = [];
    const storedUsersData = localStorage.getItem('neuroCareSignedUpUsers');
    if (storedUsersData) {
      try {
        signedUpUsers = JSON.parse(storedUsersData);
        if (!Array.isArray(signedUpUsers)) signedUpUsers = [];
      } catch (e) {
        signedUpUsers = [];
      }
    }

    const foundUser = signedUpUsers.find(user =>
        (user.email.toLowerCase() === data.identifier.toLowerCase() ||
         user.username.toLowerCase() === data.identifier.toLowerCase())
    );

    if (!foundUser) {
      toast({
        title: "Login Failed",
        description: "Account not found. Please sign up.",
        variant: "destructive",
      });
    } else if (foundUser.password !== data.password) {
      toast({
        title: "Login Failed",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    } else {
      // Login successful
      localStorage.setItem('neuroCareUserIdentifier', foundUser.username);
      localStorage.setItem('neuroCareUserEmail', foundUser.email);
      localStorage.setItem('neuroCareUserLoggedIn', 'true');
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.fullName || foundUser.username}!`,
      });
      router.push('/dashboard');
    }
    setIsLoading(false);
  }

  const startSocialLogin = (provider: SocialProvider) => {
    setActiveSocialProvider(provider);
    setSocialEmail(''); // Clear previous social email input
  };

  const cancelSocialLogin = () => {
    setActiveSocialProvider(null);
    setSocialEmail('');
    const lastUsedIdentifier = localStorage.getItem('neuroCareUserIdentifier');
    if (lastUsedIdentifier) {
      form.setValue('identifier', lastUsedIdentifier);
    } else {
      form.reset();
    }
  };

  const handleSocialLoginSubmit = async () => {
    if (!activeSocialProvider) return;
    setIsLoading(true);

    const trimmedSocialEmail = socialEmail.trim();

    if (!trimmedSocialEmail || !z.string().email().safeParse(trimmedSocialEmail).success) {
      toast({
        title: "Email Required",
        description: `Please enter a valid ${activeSocialProvider} email address to continue.`,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1500));

    let signedUpUsers: StoredUser[] = [];
    const storedUsersData = localStorage.getItem('neuroCareSignedUpUsers');
    if (storedUsersData) {
      try {
        signedUpUsers = JSON.parse(storedUsersData);
        if (!Array.isArray(signedUpUsers)) signedUpUsers = [];
      } catch (e) {
        signedUpUsers = [];
      }
    }

    let userToLogin = signedUpUsers.find(user => user.email.toLowerCase() === trimmedSocialEmail.toLowerCase());
    let userNameOrEmail: string;

    if (!userToLogin) {
      // Simulate account creation via social login
      const tempUsername = trimmedSocialEmail.split('@')[0] + Math.floor(Math.random() * 1000);
      userToLogin = {
        username: tempUsername,
        email: trimmedSocialEmail,
        password: 'social_login_mock_password', // Mock password for socially created accounts
        fullName: `User via ${activeSocialProvider}`
      };
      signedUpUsers.push(userToLogin);
      localStorage.setItem('neuroCareSignedUpUsers', JSON.stringify(signedUpUsers));
      userNameOrEmail = userToLogin.fullName || userToLogin.username;
    } else {
      userNameOrEmail = userToLogin.fullName || userToLogin.username;
    }

    localStorage.setItem('neuroCareUserIdentifier', userToLogin.username);
    localStorage.setItem('neuroCareUserEmail', userToLogin.email);
    localStorage.setItem('neuroCareUserLoggedIn', 'true');
    toast({
      title: `Logged in with ${activeSocialProvider}`,
      description: `Welcome, ${userNameOrEmail}!`,
    });
    router.push('/dashboard');
    setIsLoading(false);
    setActiveSocialProvider(null);
    setSocialEmail('');
  };

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Brain className="h-12 w-12 text-primary" />
        </div>
        {!activeSocialProvider ? (
          <>
            <CardTitle className="text-3xl font-bold">Welcome to NeuroCare</CardTitle>
            <CardDescription>Please sign in to continue to your dashboard.</CardDescription>
          </>
        ) : (
          <>
            <CardTitle className="text-2xl font-bold">Sign in with {activeSocialProvider}</CardTitle>
            <CardDescription>Enter your {activeSocialProvider} email to continue.</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {!activeSocialProvider ? (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username / Email ID</FormLabel>
                      <FormControl>
                        <Input placeholder="your_username or your.email@example.com" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <LogIn className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
                 <p className="text-center text-xs text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="font-semibold text-primary hover:underline">
                    Sign up now
                  </Link>
                </p>
              </form>
            </Form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Button variant="outline" className="w-full" onClick={() => startSocialLogin('Google')} disabled={isLoading}>
                <GoogleIcon />
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full" onClick={() => startSocialLogin('GitHub')} disabled={isLoading}>
                <Github className="mr-2 h-5 w-5" />
                Continue with GitHub
              </Button>
              <Button variant="outline" className="w-full" onClick={() => startSocialLogin('Microsoft')} disabled={isLoading}>
                <MicrosoftIcon />
                Continue with Microsoft
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="socialEmailInput">{activeSocialProvider} Email</Label>
              <Input
                id="socialEmailInput"
                type="email"
                placeholder={`your.${activeSocialProvider?.toLowerCase()}@example.com`}
                value={socialEmail}
                onChange={(e) => setSocialEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleSocialLoginSubmit} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LogIn className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Continue with {activeSocialProvider}
                </>
              )}
            </Button>
            <Button variant="outline" className="w-full" onClick={cancelSocialLogin} disabled={isLoading}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to other sign-in options
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

    