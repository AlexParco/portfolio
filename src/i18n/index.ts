import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { CLAVE_IDIOMA, DEFAULT_LANG, LANGS } from './lang'
import { recursos, type ClaveUI } from './ui'

/**
 * Tipado de i18next contra el diccionario real. Sin esto `t('lo-que-sea')` compila y
 * devuelve la clave en crudo a la pagina; con esto, una clave que no existe es un error.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'ui'
    resources: { ui: Record<ClaveUI, string> }
  }
}

void i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { es: { ui: recursos.es }, en: { ui: recursos.en } },
    ns: ['ui'],
    defaultNS: 'ui',
    fallbackLng: DEFAULT_LANG,
    supportedLngs: LANGS,
    // Sin esto un navegador en `en-US` no encuentra `en` y se cae al fallback: veria el
    // sitio en espanol teniendo el suyo traducido.
    load: 'languageOnly',
    detection: {
      // La eleccion explicita manda sobre el idioma del sistema, y se recuerda.
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: CLAVE_IDIOMA,
      caches: ['localStorage'],
    },
    // El texto va a JSX, que ya escapa por su cuenta.
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

export { i18next }
