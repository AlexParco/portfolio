import type { Snippet } from '../types'
import { snippets as meta } from './index'
import { ES } from './es'
import { EN } from './en'

/** Ver la nota de `projects/full.ts`: solo lo importa la pagina de detalle. */
export const snippets: Snippet[] = meta.map((s) => ({
  ...s,
  content: { es: ES[s.slug].content, en: EN[s.slug].content },
}))
