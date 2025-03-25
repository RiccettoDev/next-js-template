'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { i18nConfig, isValidLanguage, Language } from '../config/i18n';

// Tipos para as traduções
type TranslationKeys = {
  home: {
    welcome: string;
  };
  outro: {
    message: string;
  };
};

type Translations = {
  [key in Language]: TranslationKeys;
};

// Dados de tradução (agora usando os arquivos JSON)
const translations: Translations = {
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const pathLang = pathname.split('/')[1];
    if (isValidLanguage(pathLang)) {
      setLanguage(pathLang);
    }
  }, [pathname]);

  const changeLanguage = (newLang: Language) => {
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLang}`);
    router.push(newPath);
    document.cookie = `preferred_lang=${newLang}; path=/; max-age=${60*60*24*365}; sameSite=lax`;
  };

  const t = <K extends keyof TranslationKeys>(section: K, key: keyof TranslationKeys[K]) => {
    if (!isMounted) return '';
    return translations[language][section][key] as string;
  };

  return { language, changeLanguage, t, isMounted };
};