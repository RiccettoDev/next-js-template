import { NextRequest, NextResponse } from 'next/server';
import { i18nConfig, isValidLanguage } from '../config/i18n';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Ignora arquivos estáticos e próximos internos
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const pathParts = pathname.split('/').filter(Boolean);
  const maybeLang = pathParts[0];

  // Se já tiver um idioma válido na URL
  if (isValidLanguage(maybeLang)) {
    return NextResponse.next();
  }

  // Detecta idioma preferido
  let detectedLang = i18nConfig.defaultLanguage;
  const cookieLang = request.cookies.get('preferred_lang')?.value;
  const acceptLang = request.headers.get('accept-language');

  // 1. Tenta usar o cookie
  if (cookieLang && isValidLanguage(cookieLang)) {
    detectedLang = cookieLang;
  } 
  // 2. Fallback para header Accept-Language
  else if (acceptLang) {
    const browserLang = acceptLang.split(',')[0].split(';')[0].trim().substring(0, 2);
    if (isValidLanguage(browserLang)) {
      detectedLang = browserLang;
    }
  }

  // Redireciona para a página home no idioma detectado
  const newPath = `/${detectedLang}/home`;
  const response = NextResponse.redirect(new URL(newPath, request.url));

  // Seta cookie se não existir ou for inválido
  if (!cookieLang || !isValidLanguage(cookieLang)) {
    response.cookies.set('preferred_lang', detectedLang, {
      path: '/',
      maxAge: 31536000, // 1 ano
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
  }

  return response;
}