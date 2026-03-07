"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User, KeyRound, LogOut, Eye, EyeOff,
  CheckCircle2, ShieldCheck, Mail, AtSign,
  Calendar, RefreshCw, Camera, Pencil, Save, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import axios from "axios";
import { useAuth } from '@/app/context/AuthContext';
import { BASE_URL } from '@/app/lib/Api';

type Tab = 'profile' | 'security';

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const initialTab = (searchParams.get('tab') as Tab) ?? 'profile';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  // const [userName, setUserName]   = useState('');
  // const [userEmail, setUserEmail] = useState('');
  const { user, tokens, updateUser, logout } = useAuth();

  const [userName, setUserName] = useState(user?.name ?? "");
  const [userEmail, setUserEmail] = useState(user?.email ?? "");
  // const joinedDate = 'January 2025';
  const joinedDate = new Date(user?.created_at ?? "").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long" }
  );

useEffect(() => {
  if (!user) {
    router.replace("/login");
    return;
  }

  setUserName(user.name);
  setUserEmail(user.email);
}, [user, router]);

  // Derived initials
  const initials = userName
    .split(/[\s_]+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');

  // ── Profile edit state ──
  const [editingName, setEditingName]   = useState(false);
  const [draftName, setDraftName]       = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const startEditName = () => { setDraftName(userName); setEditingName(true); };
  const cancelEditName = () => setEditingName(false);

const saveProfile = async () => {
  if (!draftName.trim() || draftName.trim().length < 2) return;

  setSavingProfile(true);

  try {
    const res = await axios.patch(
      `${BASE_URL}/auth/edit-profile/`,
      { name: draftName.trim() },
      {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      }
    );

    const updatedName = res.data?.name ?? draftName.trim();

    setUserName(updatedName);
    updateUser({ name: updatedName });

    setEditingName(false);

    toast({
      title: "Profile updated",
      description: "Your display name has been saved.",
    });

  } catch (err: any) {
    toast({
      title: "Update failed",
      description: err?.response?.data?.detail ?? "Could not update profile",
      variant: "destructive",
    });
  } finally {
    setSavingProfile(false);
  }
};
  const [currentPw, setCurrentPw]         = useState('');
  const [newPw, setNewPw]                 = useState('');
  const [confirmPw, setConfirmPw]         = useState('');
  const [showCurrent, setShowCurrent]     = useState(false);
  const [showNew, setShowNew]             = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [savingPw, setSavingPw]           = useState(false);
  const [pwSuccess, setPwSuccess]         = useState(false);

  const pwMismatch  = !!confirmPw && newPw !== confirmPw;
  const pwTooShort  = !!newPw && newPw.length < 6;
  const pwStrength  = [
    { label: '6+ chars',  met: newPw.length >= 6 },
    { label: 'Uppercase', met: /[A-Z]/.test(newPw) },
    { label: 'Number',    met: /\d/.test(newPw)    },
  ];

  // const handleResetPassword = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!currentPw || !newPw || pwMismatch || pwTooShort) return;
  //   setSavingPw(true);
  //   await new Promise(r => setTimeout(r, 1500)); // TODO: real API
  //   setSavingPw(false);
  //   setPwSuccess(true);
  //   setCurrentPw(''); setNewPw(''); setConfirmPw('');
  //   toast({ title: 'Password updated', description: 'Your new password is active.' });
  //   setTimeout(() => setPwSuccess(false), 4000);
  // };

  // ── Logout ──
  const handleResetPassword = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newPw || pwMismatch || pwTooShort) return;

  setSavingPw(true);

  try {
    await axios.post(
      `${BASE_URL}/auth/change-password/`,
      {
        password: newPw,
        confirm_password: confirmPw,
      },
      {
        headers: {
          Authorization: `Bearer ${tokens?.access}`,
        },
      }
    );

    setPwSuccess(true);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");

    toast({
      title: "Password updated",
      description: "Your new password is active.",
    });

    setTimeout(() => setPwSuccess(false), 4000);

  } catch (err: any) {
    toast({
      title: "Password update failed",
      description: err?.response?.data?.detail ?? "Something went wrong",
      variant: "destructive",
    });
  } finally {
    setSavingPw(false);
  }
};
  const handleLogout = () => {
    logout();

    toast({
      title: "Logged out",
      description: "See you soon!",
    });

    router.push("/login");
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile',  label: 'My Profile',      icon: User      },
    { id: 'security', label: 'Password & Security', icon: ShieldCheck },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Account Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile and security preferences</p>
      </div>

      {/* Avatar + name card */}
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex items-center justify-center w-18 h-18 w-[4.5rem] h-[4.5rem] rounded-full bg-primary text-primary-foreground text-2xl font-bold ring-4 ring-primary/20">
            {initials || <User className="h-8 w-8" />}
          </div>
          {/* Photo upload placeholder */}
          <button
            className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-card border-2 border-border hover:bg-muted transition-colors"
            title="Change photo (coming soon)"
          >
            <Camera className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-foreground truncate">{userName}</p>
          <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Patient
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Calendar className="h-3 w-3" /> Joined {joinedDate}
            </span>
          </div>
        </div>

        {/* Logout button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="rounded-full gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0 hidden sm:flex"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>

      {/* Mobile logout */}
      <Button
        variant="outline"
        className="w-full sm:hidden rounded-xl gap-2 h-10 text-sm text-destructive border-destructive/30 hover:bg-destructive/8 hover:border-destructive/50 transition-colors"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" /> Sign Out
      </Button>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-muted/50 border border-border/50 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-200',
              activeTab === id
                ? 'bg-background text-foreground shadow-sm border border-border/60'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className={cn('h-3.5 w-3.5', activeTab === id ? 'text-primary' : '')} />
            <span className="hidden xs:inline sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── TAB: Profile ── */}
      {activeTab === 'profile' && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden animate-in fade-in duration-300">
          <div className="px-5 py-4 border-b bg-muted/20 flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Profile Information</p>
              <p className="text-xs text-muted-foreground">Your personal details</p>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Display name */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <AtSign className="h-3.5 w-3.5 text-muted-foreground" /> Display Name
              </Label>
              {editingName ? (
                <div className="flex gap-2">
                  <Input
                    value={draftName}
                    onChange={e => setDraftName(e.target.value)}
                    className="h-10 rounded-xl flex-1"
                    autoFocus
                    minLength={2}
                  />
                  <Button size="sm" className="rounded-xl h-10 px-4 gap-1.5"
                    onClick={saveProfile} disabled={savingProfile || draftName.trim().length < 2}>
                    {savingProfile
                      ? <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      : <><Save className="h-3.5 w-3.5" /> Save</>
                    }
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-xl h-10 px-3"
                    onClick={cancelEditName} disabled={savingProfile}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-10 rounded-xl border border-border bg-muted/30 px-3 flex items-center text-sm text-foreground">
                    {userName}
                  </div>
                  <Button size="sm" variant="ghost" className="rounded-xl h-10 px-3 gap-1.5 hover:text-primary hover:bg-primary/8"
                    onClick={startEditName}>
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                </div>
              )}
            </div>

            {/* Email — read only */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" /> Email Address
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-10 rounded-xl border border-border bg-muted/30 px-3 flex items-center justify-between">
                  <span className="text-sm text-foreground">{userEmail}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support if needed.</p>
            </div>

            {/* Role — read only */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" /> Account Role
              </Label>
              <div className="h-10 rounded-xl border border-border bg-muted/30 px-3 flex items-center">
                <span className="text-sm text-foreground">Patient</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Security ── */}
      {activeTab === 'security' && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden animate-in fade-in duration-300">
          <div className="px-5 py-4 border-b bg-muted/20 flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
              <KeyRound className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Change Password</p>
              <p className="text-xs text-muted-foreground">Use a strong, unique password</p>
            </div>
          </div>

          <form onSubmit={handleResetPassword} className="p-5 space-y-5">

            {/* Success banner */}
            {pwSuccess && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 animate-in fade-in duration-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Password updated successfully!
                </p>
              </div>
            )}

            {/* Current password */}
            {/* <div className="space-y-2">
              <Label htmlFor="currentPw" className="text-sm font-medium">Current Password</Label>
              <div className="relative">
                <Input id="currentPw"
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  value={currentPw}
                  onChange={e => setCurrentPw(e.target.value)}
                  className="h-11 rounded-xl pr-11"
                  required
                />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-right">
                <button type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-xs text-primary hover:underline font-medium">
                  Forgot current password?
                </button>
              </div>
            </div> */}

            {/* New password */}
            <div className="space-y-2">
              <Label htmlFor="newPw" className="text-sm font-medium">New Password</Label>
              <div className="relative">
                <Input id="newPw"
                  type={showNew ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  className={cn('h-11 rounded-xl pr-11', pwTooShort && 'border-destructive')}
                  required minLength={6}
                />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {/* Strength pills */}
              {newPw && (
                <div className="flex gap-1.5 pt-0.5">
                  {pwStrength.map(({ label, met }) => (
                    <span key={label} className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all duration-200',
                      met
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-border bg-muted text-muted-foreground'
                    )}>
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPw" className="text-sm font-medium">Confirm New Password</Label>
              <div className="relative">
                <Input id="confirmPw"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your new password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  className={cn('h-11 rounded-xl pr-11', pwMismatch && 'border-destructive focus-visible:ring-destructive')}
                  required
                />
                <button type="button" tabIndex={-1}
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {pwMismatch && (
                <p className="text-xs text-destructive">Passwords don't match</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl gap-2 font-semibold shadow-sm shadow-primary/20"
              disabled={savingPw || !newPw || !confirmPw || pwMismatch || pwTooShort}
            >
              {savingPw
                ? <><RefreshCw className="h-4 w-4 animate-spin" /> Updating...</>
                : <><ShieldCheck className="h-4 w-4" /> Update Password</>
              }
            </Button>
          </form>
        </div>
      )}

      {/* Danger zone */}
      {/* <div className="rounded-2xl border border-destructive/20 bg-destructive/3 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <LogOut className="h-4 w-4 text-destructive" />
          <p className="text-sm font-semibold text-destructive">Sign Out</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This will end your current session. You'll need to sign in again to access your account.
        </p>
        <Button
          variant="outline"
          className="rounded-xl gap-2 text-sm font-medium text-destructive border-destructive/30 hover:bg-destructive/8 hover:border-destructive/50 transition-colors"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> Sign Out of NeuroCare
        </Button>
      </div> */}

    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[40vh]">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    }>
      <ProfileContent />
    </Suspense>
  );
}