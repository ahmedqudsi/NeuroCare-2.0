
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Brain, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const signupFormSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters." }),
  username: z.string().min(3, { message: "Username must be at least 3 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password." }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupFormSchema>;

interface StoredUser {
  username: string;
  email: string;
  password?: string;
  fullName?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: SignupFormValues) {
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

    const existingUserByEmail = signedUpUsers.find(user => user.email.toLowerCase() === data.email.toLowerCase());
    if (existingUserByEmail) {
      toast({
        title: "Registration Failed",
        description: "This email address is already registered. Please log in or use a different email.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const existingUserByUsername = signedUpUsers.find(user => user.username.toLowerCase() === data.username.toLowerCase());
    if (existingUserByUsername) {
      toast({
        title: "Registration Failed",
        description: "This username is already taken. Please choose a different username.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Add new user
    const newUser: StoredUser = {
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName
    };
    signedUpUsers.push(newUser);
    localStorage.setItem('neuroCareSignedUpUsers', JSON.stringify(signedUpUsers));

    // Proceed to log in the new user
    localStorage.setItem('neuroCareUserIdentifier', data.username); // Store username as preferred identifier
    localStorage.setItem('neuroCareUserEmail', data.email); // Ensure email is set for AppLayout
    localStorage.setItem('neuroCareUserLoggedIn', 'true');
    
    toast({
      title: "Account Created Successfully!",
      description: `Welcome to NeuroCare, ${data.fullName}! You are now logged in.`,
    });
    
    router.push('/dashboard');
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
          <Brain className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Create your NeuroCare Account</CardTitle>
        <CardDescription>Join us to access stroke awareness and recovery tools.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a username (e.g., neuro_user)" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} disabled={isLoading} />
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
                    <Input type="password" placeholder="Create a password (min. 6 characters)" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Confirm your password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <UserPlus className="mr-2 h-4 w-4 animate-pulse" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign Up
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
