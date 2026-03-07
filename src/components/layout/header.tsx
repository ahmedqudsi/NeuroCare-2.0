"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { ThemeToggleButton } from './theme-toggle-button';
import {
  Brain, Menu, X, LogIn, UserPlus,
  User, LogOut, KeyRound, ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { NavigationItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const appName = siteConfig.appName;
  const navItems = siteConfig.sidebarNav;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);


  // const isLoggedIn = true
  const { user, isLoggedIn, logout } = useAuth();

  // const userEmail =
  //   typeof window !== 'undefined'
  //     ? (localStorage.getItem('neuroCareUserEmail') ?? '')
  //     : '';

  // const userName =
  //   typeof window !== 'undefined'
  //     ? (localStorage.getItem('neuroCareUserIdentifier') ?? 'User')
  //     : 'User';
  const userEmail = user?.email ?? "";
  const userName = user?.name ?? "-";

  const initials = userName
    .split(/[\s_]+/)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .join('');

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('neuroCareUserEmail');
  //   localStorage.removeItem('neuroCareUserLoggedIn');
  //   localStorage.removeItem('neuroCareUserIdentifier');
  //   setProfileOpen(false);
  //   setMobileOpen(false);
  //   toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  //   router.push('/login');
  // };
  
  const handleLogout = () => {
    logout();

    setProfileOpen(false);
    setMobileOpen(false);

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });

    router.push("/login");
  };
  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

        <div className="border-b bg-background/80 backdrop-blur-xl shadow-sm">
          <div className="container flex h-16 items-center justify-between gap-3 px-4">

            {/* Logo */}
            <Link href="/home" className="group flex items-center gap-2.5 shrink-0">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-all duration-200 group-hover:bg-primary/20 group-hover:ring-primary/40 group-hover:scale-105">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <span className="hidden sm:block font-semibold text-sm tracking-tight text-foreground">
                {appName}
              </span>
            </Link>

            {/* Desktop nav pill — lg+ */}
            <nav className="hidden lg:flex flex-1 items-center justify-center">
              <div className="flex items-center gap-0.5 rounded-full bg-muted/50 px-2 py-1.5 border border-border/50">
                {navItems.map((item: NavigationItem) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'relative flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 whitespace-nowrap',
                        isActive
                          ? 'bg-background text-foreground shadow-sm border border-border/60'
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/8'
                      )}
                    >
                      <item.icon className={cn('h-3.5 w-3.5 shrink-0', isActive ? 'text-primary' : '')} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0">

              {/* Theme toggle */}
              <div className="[&>button]:hover:bg-primary/10 [&>button]:hover:text-primary [&>button]:transition-colors [&>button]:rounded-full">
                <ThemeToggleButton />
              </div>

              {/* ── LOGGED IN — avatar dropdown (desktop) ── */}
              {isLoggedIn ? (
                <div className="relative hidden lg:block" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(prev => !prev)}
                    className={cn(
                      'flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border transition-all duration-200',
                      profileOpen
                        ? 'border-primary/40 bg-primary/8'
                        : 'border-border/60 bg-card hover:border-primary/30 hover:bg-primary/5'
                    )}
                  >
                    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
                      {initials || <User className="h-3.5 w-3.5" />}
                    </div>
                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                      {userName}
                    </span>
                    <ChevronDown className={cn(
                      'h-3.5 w-3.5 text-muted-foreground transition-transform duration-200',
                      profileOpen && 'rotate-180'
                    )} />
                  </button>

                  {/* Dropdown panel */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-border bg-card shadow-xl shadow-black/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">

                      {/* User info */}
                      <div className="flex items-center gap-3 px-4 py-3.5 border-b bg-muted/30">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                          {initials || <User className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                          <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="p-1.5 space-y-0.5">
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-primary/8 hover:text-primary transition-colors"
                        >
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          My Profile
                        </Link>
                        <Link
                          href="/profile?tab=security"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-primary/8 hover:text-primary transition-colors"
                        >
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted">
                            <KeyRound className="h-3.5 w-3.5" />
                          </div>
                          Reset Password
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="p-1.5 pt-0 border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/8 transition-colors"
                        >
                          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-destructive/10">
                            <LogOut className="h-3.5 w-3.5" />
                          </div>
                          Sign Out
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                /* ── LOGGED OUT — auth buttons (desktop) ── */
                <div className="hidden lg:flex items-center gap-2 ml-1">
                  <Button variant="ghost" size="sm"
                    className="rounded-full px-4 h-9 gap-1.5 text-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    asChild>
                    <Link href="/login"><LogIn className="h-3.5 w-3.5" /> Sign In</Link>
                  </Button>
                  <Button size="sm"
                    className="rounded-full px-4 h-9 gap-1.5 text-sm shadow-sm shadow-primary/20 hover:shadow-primary/40 transition-shadow"
                    asChild>
                    <Link href="/signup"><UserPlus className="h-3.5 w-3.5" /> Sign Up</Link>
                  </Button>
                </div>
              )}

              <div className="h-5 w-px bg-border mx-0.5 lg:hidden" />

              {/* Hamburger — below lg */}
              <Button variant="ghost" size="icon"
                className="lg:hidden h-9 w-9 rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
                onClick={() => setMobileOpen(prev => !prev)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>

          </div>
        </div>

        {/* Mobile / Tablet dropdown */}
        <div
          ref={menuRef}
          className={cn(
            'lg:hidden absolute left-0 right-0 z-30 border-b bg-background shadow-lg',
            'transition-all duration-300 ease-in-out overflow-hidden',
            mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          )}
        >
          <nav className="container px-4 py-4 flex flex-col gap-1">
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
              Navigation
            </p>

            {navItems.map((item: NavigationItem) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
              return (
                <Link key={item.href} href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-primary/8 hover:text-primary'
                  )}
                >
                  <div className={cn('flex items-center justify-center w-7 h-7 rounded-lg shrink-0', isActive ? 'bg-primary/20' : 'bg-muted')}>
                    <item.icon className={cn('h-3.5 w-3.5', isActive ? 'text-primary' : 'text-foreground/70')} />
                  </div>
                  <span className="flex-1">{item.label}</span>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                </Link>
              );
            })}

            {/* Auth section */}
            <div className="mt-2 pt-3 border-t border-border space-y-1">
              {isLoggedIn ? (
                <>
                  {/* User info strip */}
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/40 mb-2">
                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                      {initials || <User className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                      <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                  </div>

                  <Link href="/profile" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/8 hover:text-primary transition-colors">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted"><User className="h-3.5 w-3.5 text-foreground/70" /></div>
                    My Profile
                  </Link>

                  <Link href="/profile?tab=security" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-primary/8 hover:text-primary transition-colors">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted"><KeyRound className="h-3.5 w-3.5 text-foreground/70" /></div>
                    Reset Password
                  </Link>

                  <button onClick={handleLogout}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/8 transition-colors">
                    <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-destructive/10"><LogOut className="h-3.5 w-3.5" /></div>
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pb-1">
                  <Button variant="outline"
                    className="flex-1 rounded-xl gap-2 h-10 text-sm font-medium hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors"
                    asChild onClick={() => setMobileOpen(false)}>
                    <Link href="/login"><LogIn className="h-4 w-4" /> Sign In</Link>
                  </Button>
                  <Button className="flex-1 rounded-xl gap-2 h-10 text-sm font-medium shadow-sm shadow-primary/20"
                    asChild onClick={() => setMobileOpen(false)}>
                    <Link href="/signup"><UserPlus className="h-4 w-4" /> Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/30 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}