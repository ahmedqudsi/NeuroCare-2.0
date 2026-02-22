
import type { NavigationItem } from '@/types';
import { LayoutDashboard, Activity, Hospital, Bike, BriefcaseMedical,Home } from 'lucide-react';

export const siteConfig = {
  appName: 'NeuroCare',
  description: 'A Comprehensive Stroke Awareness & Recovery Companion',
  sidebarNav: [
    // {
    //   href: '/dashboard',
    //   label: 'Dashboard',
    //   icon: LayoutDashboard,
    // },
    {
  href: '/home',     // changed
  label: 'Home',     // changed
  icon: Home,
},
    {
      href: '/fast-test',
      label: 'FAST Test',
      icon: Activity,
    },
    {
      href: '/hospital-locator',
      label: 'Nearby Hospitals',
      icon: Hospital,
    },
    {
      href: '/rehabilitation',
      label: 'Rehab Exercises',
      icon: Bike,
    },
    {
      href: '/healthcare-services',
      label: 'Healthcare Services',
      icon: BriefcaseMedical,
    },
  ] as NavigationItem[],
};

export type SiteConfig = typeof siteConfig;
