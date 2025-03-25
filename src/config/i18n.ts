export type Language = 'pt' | 'en' | 'es';

export const i18nConfig = {
  languages: ['pt', 'en', 'es'] as const,
  defaultLanguage: 'pt',
  defaultRoute: '/home' // Adicione esta linha
} as const;

export const isValidLanguage = (lang: string): lang is Language => {
  return i18nConfig.languages.includes(lang as Language);
};