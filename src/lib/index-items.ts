import type { ProjectMeta, SnippetMeta } from '../data/types'
import { type Lang, rutaProyecto, rutaNota } from '../i18n/lang'

/**
 * Una pieza del indice. Proyectos y notas se aplanan al MISMO tipo a proposito: en el
 * indice son lo mismo —cosas que escribio— y separarlos en dos listas obligaba a leer
 * dos tablas con las mismas columnas.
 */
export interface IndexItem {
  /** Numero de orden en el indice, ya formateado ("01"). */
  n: string
  href: string
  title: string
  summary: string
  kind: 'proyecto' | 'nota'
  /** Etiquetas para la columna de tema. Como maximo se pintan las 3 primeras. */
  tags: string[]
  /** ISO 8601. */
  date: string
  /** Una nota sin cuerpo no se enlaza. */
  draft: boolean
}

/**
 * Los titulos de las notas vienen como "NestJS | @MessagePattern vs @EventPattern": el
 * tema va delante de una barra. En una tabla con columna de tema ese prefijo es ruido
 * duplicado, asi que se separa y cada mitad va a su columna.
 */
function splitNoteTitle(title: string): { topic: string[]; rest: string } {
  const i = title.indexOf('|')
  if (i === -1) return { topic: [], rest: title }
  return { topic: [title.slice(0, i).trim()], rest: title.slice(i + 1).trim() }
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * El orden es explicito, no cronologico: primero los proyectos (y dentro, produccion antes
 * que herramientas, que es el orden de `projects.ts`), despues las notas. Un indice
 * ordenado por fecha pondria arriba lo ultimo que se escribio, que no es lo mismo que lo
 * que mas importa.
 */
export function buildIndex(projects: ProjectMeta[], snippets: SnippetMeta[], lang: Lang): IndexItem[] {
  const items: IndexItem[] = projects.map((p, i) => ({
    n: pad(i + 1),
    href: rutaProyecto(p.slug),
    title: p.title,
    summary: p.summary[lang],
    kind: 'proyecto',
    tags: p.tags,
    date: p.date,
    draft: false,
  }))

  snippets.forEach((s, i) => {
    const { topic, rest } = splitNoteTitle(s.title[lang])
    items.push({
      n: pad(projects.length + i + 1),
      href: rutaNota(s.slug),
      title: rest,
      summary: s.summary[lang],
      kind: 'nota',
      tags: topic,
      date: s.date,
      draft: s.draft,
    })
  })

  return items
}
