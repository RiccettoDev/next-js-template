'use client';

import { Language } from '../../../config/i18n'; // Adicione esta importação
import { useLanguage } from '../../../hooks/useLanguage';

export default function OtherPage() {
  const { t, language, changeLanguage, isMounted } = useLanguage();

  if (!isMounted) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t('outro', 'message')}</h1>
      
      <select
        value={language}
        onChange={(e) => changeLanguage(e.target.value as Language)}
        className="p-2 border rounded"
      >
        <option value="pt">Português</option>
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>

      <p className="mt-4 text-sm text-gray-600">URL atual: /{language}/outro</p>
    </div>
  );
}