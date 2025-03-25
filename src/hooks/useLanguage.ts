'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { i18nConfig, isValidLanguage, Language } from '../config/i18n';

type TranslationSection = {
  [key: string]: string;
};

type TranslationData = {
  home: TranslationSection;
  outro: TranslationSection;
};

const defaultTranslations: Record<Language, TranslationData> = {
  pt: {
    home: { welcome: 'Bem-vindo' },
    outro: { message: 'Por aqui outras coisas acontecem' }
  },
  en: {
    home: { welcome: 'Welcome' },
    outro: { message: 'Other things happen here' }
  },
  es: {
    home: { welcome: 'Bienvenido' },
    outro: { message: 'Otras cosas pasan por aquí' }
  }
};

export const useLanguage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [language, setLanguage] = useState<Language>(i18nConfig.defaultLanguage);
  const [translations, setTranslations] = useState<Record<Language, TranslationData>>(defaultTranslations);
  const [isMounted, setIsMounted] = useState(false);

  // Carrega as traduções do JSON
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const loadedTranslations = { ...defaultTranslations };
        
        await Promise.all(
          i18nConfig.languages.map(async (lang) => {
            try {
              const data = await import(`../locales/${lang}/common.json`);
              loadedTranslations[lang] = {
                home: { 
                  welcome: data.default?.home?.welcome || defaultTranslations[lang].home.welcome 
                },
                outro: { 
                  message: data.default?.outro?.message || defaultTranslations[lang].outro.message 
                }
              };
            } catch (error) {
              console.error(`Failed to load ${lang} translations:`, error);
              loadedTranslations[lang] = defaultTranslations[lang];
            }
          })
        );
        
        setTranslations(loadedTranslations);
      } catch (error) {
        console.error('Error loading translations:', error);
        setTranslations(defaultTranslations);
      } finally {
        setIsMounted(true);
      }
    };

    loadTranslations();
  }, []);

  // Atualiza o idioma quando a URL muda
  useEffect(() => {
    const pathLang = pathname.split('/')[1];
    if (isValidLanguage(pathLang)) {
      setLanguage(pathLang);
    }
  }, [pathname]);

  const changeLanguage = useCallback((newLang: Language) => {
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLang}`);
    router.push(newPath);
    document.cookie = `preferred_lang=${newLang}; path=/; max-age=${60*60*24*365}; sameSite=lax`;
  }, [pathname, router]);

  const t = useCallback(<K extends keyof TranslationData>(
    section: K,
    key: keyof TranslationData[K]
  ): string => {
    if (!isMounted) return '';
    return translations[language]?.[section]?.[key] ?? '';
  }, [language, translations, isMounted]);

  return { 
    language, 
    changeLanguage, 
    t, 
    isMounted 
  };
};