import type { JSX } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArticleHead } from '../components/ArticleHead'
import { ArticleNav } from '../components/ArticleNav'
import { DecisionRecord } from '../components/DecisionRecord'
import { Diagram } from '../components/Diagram'
import { Prose } from '../components/Prose'
import { NotFound } from './NotFound'
import { projects } from '../data/projects/full'
import { formatDate } from '../lib/format'
import type { Project } from '../data/types'
import { useLang } from '../i18n/useLang'
import { rutaProyecto } from '../i18n/lang'

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
    <figure className="my-10 overflow-hidden rounded-xl border border-rule bg-surface">
      <img
        ref={ref}
        src={`${import.meta.env.BASE_URL}${project.image}`}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`block h-auto w-full transition-opacity duration-(--dur-image) ease-(--ease-out) ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </figure>
  )
}

export function ProjectDetail(): JSX.Element {
  const { lang, t, tr } = useLang()
  const { slug } = useParams<{ slug: string }>()
  const i = projects.findIndex((item) => item.slug === slug)
  const project = projects[i]

  if (!project) return <NotFound />

  const toNav = (p: Project | undefined) => (p ? { href: rutaProyecto(p.slug), title: p.title } : null)

  return (
    <article>
      <ArticleHead
        kicker={t('proyecto')}
        date={formatDate(project.date, lang)}
        dateISO={project.date}
        title={project.title}
        summary={tr(project.summary)}
        tags={project.tags}
        links={[
          ...(project.demo ? [{ label: t('demo'), href: project.demo }] : []),
          ...(project.repo ? [{ label: t('codigo'), href: project.repo }] : []),
        ]}
      />

      <DecisionRecord decision={project.decision} />

      {tr(project.diagram) && <Diagram>{tr(project.diagram)}</Diagram>}

      {project.image && <ProjectImage project={project} alt={`${t('captura')} — ${project.title}`} />}

      <div className="mt-12">
        <Prose>{tr(project.body)}</Prose>
      </div>

      <ArticleNav prev={toNav(projects[i - 1])} next={toNav(projects[i + 1])} />
    </article>
  )
}
