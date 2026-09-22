/**
 * Idioma del sitio.
 *
 * Vive en el NAVEGADOR (localStorage, con el idioma del sistema como primera pista), no en
 * la URL. Es una decision con precio y conviene tenerlo escrito: una sola URL sirve las dos
 * versiones, asi que no se puede compartir el enlace de una nota "en ingles" ni un buscador
 * puede indexar las dos. A cambio las URLs quedan limpias y no hay `/en` colgando de todo.
 */
export type Lang = 'es' | 'en'

export const LANGS = ['es', 'en'] as const satisfies readonly Lang[]

export const DEFAULT_LANG: Lang = 'es'

/** Donde se guarda la preferencia. Lo comparten i18next y el script de `index.html`. */
export const CLAVE_IDIOMA = 'lang'

/**
 * Un valor traducido. `Record` sobre los dos idiomas, no un opcional: si a un texto le falta
 * uno, no compila. Es la unica garantia que impide publicar un hueco en blanco.
 */
export type L<T = string> = Record<Lang, T>

/** Normaliza lo que devuelve el detector: puede venir `en-US`, `es-419` o algo que no existe. */
export function normaliza(valor: string | undefined): Lang {
  const corto = (valor ?? '').split('-')[0]
  return (LANGS as readonly string[]).includes(corto) ? (corto as Lang) : DEFAULT_LANG
}

// Las rutas no llevan idioma y sus segmentos van SIEMPRE en ingles, tambien cuando la
// pagina se lee en castellano. Una pieza tiene una sola URL, y esa URL no cambia nunca:
// es lo que hace que un enlace compartido siga vivo pase lo que pase con el idioma.
export const RUTA_INICIO = '/'
export const rutaProyecto = (slug: string): string => `/projects/${slug}`
export const rutaNota = (slug: string): string => `/notes/${slug}`
