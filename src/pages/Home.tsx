import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { Section } from '../components/Section'
import { profile } from '../data/profile'
import { projects } from '../data/projects'
import { snippets } from '../data/snippets'
import { experience } from '../data/experience'
import { formatShortDate, formatYear, formatYearRange } from '../lib/format'
import { splitNoteTitle } from '../lib/titles'
import { useLang } from '../i18n/useLang'
import { rutaNota, rutaProyecto } from '../i18n/lang'

// Las notas se leen como un blog: la mas reciente primero. Los proyectos NO se reordenan:
// su orden en `projects/index.ts` es deliberado (produccion antes que herramientas).
const notasPorFecha = [...snippets].sort((a, b) => b.date.localeCompare(a.date))

export function Home(): JSX.Element {
  const { lang, t, tr } = useLang()

  return (
    <>
      <Hero />

      {/* -mt: la entradilla sube hasta la cola de la mascara del hero, donde la foto ya es
          casi transparente, para que la foto y el texto se lean como una sola pieza. */}
      <section aria-label={t('sobreMi')} className="relative -mt-6">
        <p className="text-lead text-ink-muted">{tr(profile.intro)}</p>

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.9375rem]">
          {profile.socials.map((social) => {
            const external = !social.url.startsWith('mailto:')
            return (
              <li key={social.label}>
                <a
                  href={social.url}
                  className="link"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {social.label}
                  {external && <span className="sr-only"> {t('nuevaPestana')}</span>}
                </a>
              </li>
            )
          })}
          <li>
            <a
              href={`${import.meta.env.BASE_URL}${profile.cv}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {t('cv')}
              <span className="sr-only"> {t('pdfNuevaPestana')}</span>
            </a>
          </li>
        </ul>
      </section>

      <Section id="proyectos" title={t('seccionProyectos')}>
        <ul className="-mx-3 flex flex-col">
          {projects.map((p) => (
            <li key={p.slug}>
              <Link
                data-ball
                to={rutaProyecto(p.slug)}
                className="group block rounded-lg px-3 py-3 transition-colors duration-(--dur-state) hover:bg-bg-hover"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-title text-ink transition-colors duration-(--dur-state) group-hover:text-accent">
                    {p.title}
                  </span>
                  <span className="shrink-0 font-mono text-meta text-ink-faint tabular-nums">
                    {formatYear(p.date, lang)}
                  </span>
                </div>
                <p className="mt-0.5 text-[0.9375rem] leading-relaxed text-ink-muted">{tr(p.summary)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="notas" title={t('seccionNotas')}>
        <ul className="-mx-3 flex flex-col">
          {notasPorFecha.map((s) => {
            const { topic, rest } = splitNoteTitle(tr(s.title))
            const fecha = <time dateTime={s.date}>{formatShortDate(s.date, lang)}</time>
            const cuerpo = (
              <>
                <span className="font-mono text-meta text-ink-faint tabular-nums sm:w-28 sm:shrink-0">
                  {fecha}
                </span>
                <span className="min-w-0">
                  {topic && <span className="text-ink-faint">{topic} · </span>}
                  <span className="text-ink transition-colors duration-(--dur-state) group-hover:text-accent">
                    {rest}
                  </span>
                </span>
              </>
            )
            const clases =
              'group flex flex-col gap-0.5 rounded-lg px-3 py-2.5 sm:flex-row sm:items-baseline sm:gap-4'
            return (
              <li key={s.slug}>
                {s.draft ? (
                  <div className={`${clases} opacity-60`}>
                    {cuerpo}
                    <span className="font-mono text-micro text-ink-faint">{t('borrador')}</span>
                  </div>
                ) : (
                  <Link
                    data-ball
                    to={rutaNota(s.slug)}
                    className={`${clases} transition-colors duration-(--dur-state) hover:bg-bg-hover`}
                  >
                    {cuerpo}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </Section>

      <Section id="experiencia" title={t('experiencia')}>
        <ul className="flex flex-col gap-y-2">
          {experience.map((job) => (
            <li
              key={`${job.company}-${job.start}`}
              data-ball
              className="-mx-3 flex flex-col gap-0.5 rounded-lg px-3 py-1 sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="font-mono text-meta text-ink-faint tabular-nums sm:w-28 sm:shrink-0">
                {formatYearRange(job.start, job.end, lang)}
              </span>
              <span>
                <span className="text-ink">{job.company}</span>
                <span className="text-ink-muted"> — {tr(job.role)}</span>
              </span>
            </li>
          ))}
        </ul>
        <Link to="/about" className="link mt-8 inline-block text-[0.9375rem]">
          {t('masSobreMi')} →
        </Link>
      </Section>
    </>
  )
}
