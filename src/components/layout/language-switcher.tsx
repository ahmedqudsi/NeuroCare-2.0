
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { siteConfig } from '@/config/site';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import type { Locale } from '@/types';

interface LanguageSwitcherTranslations {
  changeLanguage: string;
  en: string;
  te: string;
  hi: string;
  ur: string;
  ar: string;
  zh: string;
  [key: string]: string;
}

interface LanguageSwitcherProps {
  currentLocale: Locale;
  translations: LanguageSwitcherTranslations;
}

export function LanguageSwitcher({ currentLocale, translations }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (newLocale: Locale) => {
    if (!pathname || newLocale === currentLocale) return;

    // Pathname will be /<locale>/... or /<locale>
    // Replace the current locale prefix with the new one
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };
  
  const getLanguageName = (locale: Locale): string => {
    return translations[locale] || locale.toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label={translations.changeLanguage}>
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{translations.changeLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {siteConfig.i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => changeLocale(locale)}
            disabled={currentLocale === locale}
          >
            {getLanguageName(locale)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
