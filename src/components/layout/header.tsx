"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { ThemeToggleButton } from './theme-toggle-button';
import { Brain, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { NavigationItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect, useRef } from 'react';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const appName = siteConfig.appName;
  const navItems = siteConfig.sidebarNav;

  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);


  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem('neuroCareUserEmail');
    localStorage.removeItem('neuroCareUserLoggedIn');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

        <div className="border-b bg-background/80 backdrop-blur-xl shadow-sm">
          <div className="container flex h-16 items-center justify-between gap-4 px-4">

            <Link
              href="/home"
              className="group flex items-center gap-2.5 shrink-0"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 ring-1 ring-primary/20 transition-all duration-200 group-hover:bg-primary/20 group-hover:ring-primary/40 group-hover:scale-105">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-semibold text-sm tracking-tight text-foreground">
                  {appName}
                </span>
                {/* <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-medium">
                  Healthcare
                </span> */}
              </div>
            </Link>

            <nav className="hidden md:flex flex-1 items-center justify-center">
              <div className="flex items-center gap-1 rounded-full bg-muted/50 px-2 py-1.5 border border-border/50">
                {navItems.map((item: NavigationItem) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'relative flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200',
                        isActive
                          ? 'bg-background text-foreground shadow-sm border border-border/60'
                          : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-3.5 w-3.5 shrink-0',
                          isActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <ThemeToggleButton />

              <div className="h-5 w-px bg-border mx-1 hidden sm:block" />

              {/* <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Sign out"
                className="hidden md:flex h-9 w-9 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
              </Button> */}

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 rounded-full"
                onClick={() => setMobileOpen(prev => !prev)}
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen
                  ? <X className="h-5 w-5" />
                  : <Menu className="h-5 w-5" />
                }
              </Button>
            </div>

          </div>
        </div>

        <div
          ref={menuRef}
          className={cn(
            'md:hidden absolute left-0 right-0 z-30 border-b bg-background/95 backdrop-blur-xl shadow-lg transition-all duration-300 ease-in-out overflow-hidden',
            mobileOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          )}
        >
          <nav className="container px-4 py-3 flex flex-col gap-1">
            <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Navigation
            </p>

            {navItems.map((item: NavigationItem) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <div className={cn(
                    'flex items-center justify-center w-7 h-7 rounded-lg',
                    isActive ? 'bg-primary/15' : 'bg-muted'
                  )}>
                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                  </div>
                  {item.label}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}

            <div className="my-1 h-px bg-border" />
            {/* <button
              onClick={() => { setMobileOpen(false); handleLogout(); }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150 w-full text-left mb-1"
            >
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-muted">
                <LogOut className="h-3.5 w-3.5 shrink-0" />
              </div>
              Sign out
            </button> */}
          </nav>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}