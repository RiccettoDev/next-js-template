export const i18nConfig = {
  languages: ['pt', 'en', 'es'] as const,
  defaultLanguage: 'pt',
  defaultRoute: '/home'
} as const;

// Exportamos o tipo Language para uso em outros arquivos
export type Language = typeof i18nConfig.languages[number];

export const isValidLanguage = (lang: string): lang is Language => {
  return i18nConfig.languages.includes(lang as Language);
};