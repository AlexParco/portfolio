import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import { Section } from '../components/Section'
import { profile } from '../data/profile'
import { education, experience } from '../data/experience'
import { formatRange } from '../lib/format'
import { useLang } from '../i18n/useLang'

export function About(): JSX.Element {
  const { lang, t, tr } = useLang()
  const bio = tr(profile.bio).trim().split(/\n{2,}/)

  return (
    <>
      <Link
        to="/"
        className="-ml-2 inline-flex rounded-md px-2 py-1 text-[0.9375rem] text-ink-muted transition-colors duration-(--dur-state) hover:text-ink"
      >
        {t('volver')}
      </Link>

      <h1 className="mt-8 text-h1 text-ink">{t('sobreMi')}</h1>

      <div className="mt-8 flex flex-col gap-y-6 text-body text-ink/85">
        {bio.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <Section id="experiencia" title={t('experiencia')}>
        <ol className="flex flex-col gap-y-10">
          {experience.map((job) => (
            <li key={`${job.company}-${job.start}`}>
              <div className="flex flex-col gap-x-4 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-title text-ink">
                  {job.company} <span className="font-normal text-ink-muted">— {tr(job.role)}</span>
                </h3>
                <span className="shrink-0 font-mono text-meta text-ink-faint tabular-nums">
                  {formatRange(job.start, job.end, lang)}
                </span>
              </div>
              <p className="mt-1 text-[0.9375rem] text-ink-muted">{tr(job.summary)}</p>
              <ul className="mt-3 flex list-disc flex-col gap-y-1.5 pl-5 text-[0.9375rem] leading-relaxed text-ink/85 marker:text-ink-faint">
                {tr(job.highlights).map((h) => (
                  <li key={h.slice(0, 32)} className="pl-1">
                    {h}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="educacion" title={t('educacion')}>
        <ul className="flex flex-col gap-y-4">
          {education.map((s) => (
            <li
              key={s.institution}
              className="flex flex-col gap-x-4 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span>
                <span className="text-ink">{s.institution}</span>
                <span className="text-ink-muted">
                  {' '}
                  — {tr(s.program)} · {tr(s.status)}
                </span>
              </span>
              <span className="shrink-0 font-mono text-meta text-ink-faint tabular-nums">
                {formatRange(s.start, s.end, lang)}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="contacto" title={t('contacto')}>
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {profile.socials.map((social) => {
            const external = !social.url.startsWith('mailto:')
            return (
              <li key={social.label}>
                <a
                  href={social.url}
                  className="link"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {external ? social.label : social.url.replace('mailto:', '')}
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
              {t('descargarCV')}
              <span className="sr-only"> {t('pdfNuevaPestana')}</span>
            </a>
          </li>
        </ul>
      </Section>
    </>
  )
}
