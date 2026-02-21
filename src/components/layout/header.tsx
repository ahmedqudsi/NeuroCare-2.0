
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { ThemeToggleButton } from './theme-toggle-button';
import { Brain, Menu, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import type { NavigationItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const appName = siteConfig.appName;
  const navItems = siteConfig.sidebarNav;
  const toggleMenuText = "Toggle menu"; // Static text

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
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline-block font-bold">{appName}</span>
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center justify-center space-x-4 lg:space-x-6">
          {navItems.map((item: NavigationItem) => {
            const itemPath = item.href;
            const isActive = pathname === itemPath || (item.href !== '/dashboard' && pathname.startsWith(itemPath + '/'));
            return (
              <Link
                key={item.href}
                href={itemPath}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-foreground/75 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggleButton />
          <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Logout">
            <LogOut className="h-[1.2rem] w-[1.2rem]" />
          </Button>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{toggleMenuText}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs p-6">
                 <div className="mb-6 flex justify-between items-center">
                   <Link href="/dashboard" className="flex items-center space-x-2">
                     <Brain className="h-7 w-7 text-primary" />
                     <span className="text-lg font-semibold">
                       {appName}
                     </span>
                   </Link>
                 </div>
                <nav className="flex flex-col space-y-3">
                  {navItems.map((item: NavigationItem) => {
                     const itemPath = item.href;
                     const isActive = pathname === itemPath || (item.href !== '/dashboard' && pathname.startsWith(itemPath + '/'));
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={itemPath}
                          className={cn(
                            "flex items-center rounded-md p-2 text-base font-medium transition-colors",
                            isActive
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          )}
                        >
                          <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SheetClose>
                    );
                  })}
                   <SheetClose asChild>
                     <Button variant="ghost" onClick={handleLogout} className="flex items-center p-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground justify-start">
                        <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                        <span className="truncate">Logout</span>
                     </Button>
                   </SheetClose>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
