import type { JSX } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Block } from '../components/Block'
import { PieceHead } from '../components/PieceHead'
import { Reading } from '../components/Reading'
import { DecisionRecord } from '../components/DecisionRecord'
import { Diagram } from '../components/Diagram'
import { NotFound } from './NotFound'
import { projects } from '../data/projects/full'
import { formatDate } from '../lib/format'
import type { Project } from '../data/types'
import { useLang } from '../i18n/useLang'

function ProjectImage({ project, alt }: { project: Project; alt: string }): JSX.Element | null {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  // Una imagen ya cacheada no dispara onLoad: se comprueba `complete` al montar.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true)
  }, [])

  if (failed) return null

  return (
    <figure className="w-fit max-w-full rounded-sharp border border-rule bg-surface p-2">
      <img
        ref={ref}
        src={`${import.meta.env.BASE_URL}${project.image}`}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`block h-auto max-w-full rounded-sharp transition-opacity duration-(--dur-image) ease-(--ease-out) ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </figure>
  )
}

export function ProjectDetail(): JSX.Element {
  const { lang, t, tr } = useLang()
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find((item) => item.slug === slug)

  if (!project) return <NotFound />

  return (
    <article>
      <PieceHead
        kind={t('proyecto')}
        title={project.title}
        summary={tr(project.summary)}
        date={formatDate(project.date, lang)}
        tags={project.tags}
        links={[
          ...(project.repo ? [{ label: t('codigo'), href: project.repo }] : []),
          ...(project.demo ? [{ label: t('demo'), href: project.demo }] : []),
        ]}
      />

      <Block id="decision" label={t('decision')}>
        <DecisionRecord decision={project.decision} />
      </Block>

      {tr(project.diagram) && (
        <Block id="sistema" label={t('sistema')}>
          <Diagram>{tr(project.diagram)}</Diagram>
        </Block>
      )}

      {project.image && (
        <Block id="captura" label={t('captura')}>
          <ProjectImage project={project} alt={`${t('captura')} — ${project.title}`} />
        </Block>
      )}

      <Block id="sobre" label={t('sobre')}>
        <Reading>{tr(project.body)}</Reading>
      </Block>
    </article>
  )
}
