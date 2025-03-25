// Este arquivo só será acessado se o middleware falhar
import { redirect } from 'next/navigation';
import { i18nConfig } from '../config/i18n';

// Esta página nunca será acessada diretamente devido ao middleware
// É apenas um fallback seguro
export default function RootPage() {
  redirect(`/${i18nConfig.defaultLanguage}/home`);
}