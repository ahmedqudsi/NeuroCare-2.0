"use client";

import { useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Brain,
  KeyRound,
  Eye,
  EyeOff,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BASE_URL } from "@/app/lib/Api";

function ResetPasswordContent() {
  const router = useRouter();
  const params = useParams();

  const uid = (params?.uid as string) ?? "";
  const token = (params?.token as string) ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const passwordMismatch = !!confirmPassword && password !== confirmPassword;
  const passwordTooShort = !!password && password.length < 6;

  const strengthChecks = [
    { label: "6+ chars", met: password.length >= 6 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Number", met: /\d/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordMismatch || passwordTooShort) return;
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(
        `${BASE_URL}/auth/password-reset/${uid}/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, confirm_password: confirmPassword }),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data?.detail ?? "Reset failed. The link may have expired.");
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Something went wrong. Please try again.");
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
            <p className="text-[11px] uppercase tracking-widest text-white/60 font-medium">
              Healthcare
            </p>
          </div>
        </div>
        <div className="relative space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Set New Password
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            Choose a strong new password
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-sm">
            Your identity has been verified. Create a new password to regain
            full access to your account.
          </p>
          <div className="space-y-3 pt-2">
            {[
              {
                num: "✓",
                title: "Identity verified",
                desc: "Your reset link was valid",
              },
              {
                num: "2",
                title: "Set a new password",
                desc: "Choose something strong and unique",
              },
              {
                num: "3",
                title: "Sign in",
                desc: "Use your new password to log in",
              },
            ].map(({ num, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
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
          {[
            { value: "Strong", label: "Encryption" },
            { value: "Safe", label: "Process" },
            { value: "1-click", label: "Sign in" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-white/60 font-medium mt-0.5">
                {label}
              </p>
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
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Healthcare
              </p>
            </div>
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center text-center gap-6 py-4 animate-in fade-in zoom-in-95 duration-500">
              <div className="relative">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Password updated!
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                  Your password has been changed successfully. Redirecting you
                  to sign in...
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Redirecting to sign in...
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20">
                  <KeyRound className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Set a new password
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1.5">
                    Choose a strong password for your NeuroCare account.
                  </p>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive animate-in fade-in duration-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    New password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      className={cn(
                        "h-11 rounded-xl pr-11",
                        passwordTooShort && "border-destructive",
                      )}
                      required
                      minLength={6}
                      autoFocus
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {/* Strength pills */}
                  {password && (
                    <div className="flex gap-1.5 pt-0.5">
                      {strengthChecks.map(({ label, met }) => (
                        <span
                          key={label}
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all duration-200",
                            met
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-border bg-muted text-muted-foreground",
                          )}
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-sm font-medium">
                    Confirm new password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      className={cn(
                        "h-11 rounded-xl pr-11",
                        passwordMismatch &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {passwordMismatch && (
                    <p className="text-xs text-destructive">
                      Passwords don't match
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl gap-2 font-semibold shadow-sm shadow-primary/20 mt-1"
                  disabled={
                    isLoading ||
                    !password ||
                    !confirmPassword ||
                    passwordMismatch ||
                    passwordTooShort
                  }
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Updating
                      password...
                    </>
                  ) : (
                    <>
                      Update Password <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <RefreshCw className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
