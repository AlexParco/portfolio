import { useTranslation } from 'react-i18next'
import { type L, type Lang, normaliza } from './lang'
import type { ClaveUI } from './ui'

/**
 * El acceso al idioma para toda la aplicacion.
 *
 * - `t` traduce un ROTULO de interfaz por clave (lo resuelve i18next).
 * - `tr` elige la rama de un valor ya traducido (`{ es, en }`), que es como viven los datos:
 *   los cuerpos de 600 palabras no entran en un JSON de traducciones sin volverse
 *   inmanejables, asi que se quedan en sus ficheros y aqui solo se escoge cual.
 * - `cambiar` cambia el idioma y lo persiste; el detector se encarga del localStorage.
 */
export function useLang(): {
  lang: Lang
  t: (clave: ClaveUI) => string
  tr: <T>(valor: L<T>) => T
  cambiar: (destino: Lang) => void
} {
  const { t, i18n } = useTranslation('ui')
  const lang = normaliza(i18n.resolvedLanguage ?? i18n.language)

  return {
    lang,
    t: (clave) => t(clave),
    tr: (valor) => valor[lang],
    cambiar: (destino) => {
      void i18n.changeLanguage(destino)
    },
  }
}
