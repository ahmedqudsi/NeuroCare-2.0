// src/lib/get-dictionary.ts
// import 'server-only'; // Removed to allow client-side usage for dynamic JSON imports
import type { siteConfig } from '@/config/site';

type Locale = typeof siteConfig.i18n.locales[number];

// We define a type for our dictionary structure for better type safety
// This should ideally match the structure of your common.json files
// For simplicity, using `any` for now, but you should type this properly.
export type Dictionary = any; 

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/locales/en/common.json').then((module) => module.default),
  te: () => import('@/locales/te/common.json').then((module) => module.default),
  hi: () => import('@/locales/hi/common.json').then((module) => module.default),
  ur: () => import('@/locales/ur/common.json').then((module) => module.default),
  ar: () => import('@/locales/ar/common.json').then((module) => module.default),
  zh: () => import('@/locales/zh/common.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  const load = dictionaries[locale] || dictionaries.en; // Fallback to English
  try {
    return await load();
  } catch (error) {
    console.warn(`Could not load dictionary for locale: ${locale}. Falling back to 'en'.`, error);
    return await dictionaries.en(); // Ensure fallback if specific locale load fails
  }
};
