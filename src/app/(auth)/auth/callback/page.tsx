"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/app/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Brain, RefreshCw } from "lucide-react";
import { BASE_URL } from "@/app/lib/Api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const { toast } = useToast();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleAuth = async () => {
      const access = searchParams.get("access");
      const refresh = searchParams.get("refresh");

      if (!access) {
        toast({
          title: "Login failed",
          description: "No access token received.",
          variant: "destructive",
        });
        router.replace("/login");
        return;
      }

      try {
        const { data: profileData } = await axios.get(
          `${BASE_URL}/auth/profile/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        login(
          { access, refresh: refresh ?? "" },
          {
            id: profileData.id,
            name: profileData.name,
            email: profileData.email,
            gender: profileData.gender,
            role: profileData.role,
            created_at: profileData.created_at,
          }
        );

        toast({
          title: `Welcome, ${profileData.name}!`,
          description: "Signed in successfully.",
        });

        router.replace("/home");

      } catch (err) {
        console.error(err);

        toast({
          title: "Login failed",
          description: "Could not fetch user profile.",
          variant: "destructive",
        });

        router.replace("/login");
      }
    };

    handleAuth();
  }, []);

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