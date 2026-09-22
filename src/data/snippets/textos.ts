/** Los slugs de las notas. El slug NO se traduce: la URL de una nota es la misma en los
 *  dos idiomas salvo por el prefijo y el segmento, para que un enlace no muera al cambiar
 *  de idioma. */
export type SlugNota =
  | 'nestjs-message-pattern-vs-event-pattern'
  | 'tmux-many-sessions'
  | 'agent-persistent-memory'
  | 'expo-eas-apk-build'

/** Solo el cuerpo: titulo y resumen los pinta el indice y viven con los metadatos. */
export interface TextoNota {
  /** Markdown. */
  content: string
}

export type TextosNota = Record<SlugNota, TextoNota>
