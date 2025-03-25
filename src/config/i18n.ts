export const i18nConfig = {
  languages: ['pt', 'en', 'es'] as const,
  defaultLanguage: 'pt' as const, // Adicione 'as const' aqui
  defaultRoute: '/home'
} as const;

export type Language = typeof i18nConfig.languages[number];

export const isValidLanguage = (lang: string): lang is Language => {
  return i18nConfig.languages.includes(lang as Language);
};