import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, translations, TranslationKey } from './translations';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'de',
      setLanguage: (lang) => set({ language: lang }),
      t: (key) => {
        const lang = get().language;
        return translations[lang][key] || key;
      },
    }),
    {
      name: 'language-storage',
    }
  )
);
