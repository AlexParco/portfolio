import type { JSX } from 'react'
import { useParams } from 'react-router-dom'
import { ArticleHead } from '../components/ArticleHead'
import { ArticleNav } from '../components/ArticleNav'
import { Prose } from '../components/Prose'
import { NotFound } from './NotFound'
import { snippets } from '../data/snippets/full'
import type { Snippet } from '../data/types'
import { formatDate } from '../lib/format'
import { splitNoteTitle } from '../lib/titles'
import { useLang } from '../i18n/useLang'
import { rutaNota } from '../i18n/lang'

// Mismo orden que la portada: la mas reciente primero. Los borradores no se enlazan.
const publicadas = snippets
  .filter((s) => !s.draft)
  .sort((a, b) => b.date.localeCompare(a.date))

export function SnippetDetail(): JSX.Element {
  const { lang, t, tr } = useLang()
  const { slug } = useParams<{ slug: string }>()
  const i = publicadas.findIndex((item) => item.slug === slug)
  const snippet = publicadas[i]

  if (!snippet) return <NotFound />

  const { topic, rest } = splitNoteTitle(tr(snippet.title))
  // "Anterior" es la mas antigua, "siguiente" la mas nueva: el orden de lectura de un blog.
  const toNav = (s: Snippet | undefined) =>
    s ? { href: rutaNota(s.slug), title: splitNoteTitle(tr(s.title)).rest } : null

  return (
    <article>
      <ArticleHead
        kicker={topic || t('nota')}
        date={formatDate(snippet.date, lang)}
        dateISO={snippet.date}
        title={rest}
        summary={tr(snippet.summary)}
        tags={[]}
        links={[]}
      />

      <Prose>{tr(snippet.content)}</Prose>

      <ArticleNav prev={toNav(publicadas[i + 1])} next={toNav(publicadas[i - 1])} />
    </article>
  )
}
