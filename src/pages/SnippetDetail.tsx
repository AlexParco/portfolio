import type { JSX } from 'react'
import { useParams } from 'react-router-dom'
import { Block } from '../components/Block'
import { PieceHead } from '../components/PieceHead'
import { Reading } from '../components/Reading'
import { NotFound } from './NotFound'
import { snippets } from '../data/snippets/full'
import { formatDate } from '../lib/format'
import { useLang } from '../i18n/useLang'

/**
 * El titulo de una nota viene como "NestJS | @MessagePattern vs @EventPattern": el tema va
 * delante de una barra. Se separan igual que en el indice — el tema a su celda de la ficha
 * y el resto al titular— para que el mismo dato no aparezca dos veces en la misma pantalla.
 */
function split(title: string): { topic: string[]; rest: string } {
  const i = title.indexOf('|')
  if (i === -1) return { topic: [], rest: title }
  return { topic: [title.slice(0, i).trim()], rest: title.slice(i + 1).trim() }
}

export function SnippetDetail(): JSX.Element {
  const { lang, t, tr } = useLang()
  const { slug } = useParams<{ slug: string }>()
  const snippet = snippets.find((item) => item.slug === slug)

  if (!snippet) return <NotFound />

  const { topic, rest } = split(tr(snippet.title))

  return (
    <article>
      <PieceHead
        kind={t('nota')}
        title={rest}
        summary={tr(snippet.summary)}
        date={formatDate(snippet.date, lang)}
        tags={topic}
        links={[]}
      />

      <Block id="nota" label={t('nota')}>
        <Reading>{tr(snippet.content)}</Reading>
      </Block>
    </article>
  )
}
