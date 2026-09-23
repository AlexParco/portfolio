import { Link } from 'react-router-dom'
import { useLang } from '../i18n/useLang'

export interface ArticleLink {
  label: string
  href: string
}

/**
 * La cabecera de un post: volver, metadato en una linea, titular, entradilla y enlaces.
 * Proyectos y notas usan la misma: en un sitio tipo blog ambos son entradas.
 */
export function ArticleHead({
  kicker,
  date,
  dateISO,
  title,
  summary,
  tags,
  links,
}: {
  kicker: string
  date: string
  dateISO: string
  title: string
  summary: string
  tags: string[]
  links: ArticleLink[]
}): React.JSX.Element {
  const { t } = useLang()

  return (
    <header className="mb-12">
      <Link
        to="/"
        className="-ml-2 inline-flex rounded-md px-2 py-1 text-[0.9375rem] text-ink-muted transition-colors duration-(--dur-state) hover:text-ink"
      >
        {t('volver')}
      </Link>

      <p className="mt-8 font-mono text-meta text-ink-faint">
        {kicker} · <time dateTime={dateISO}>{date}</time>
      </p>
      <h1 className="mt-3 text-h1 text-ink">{title}</h1>
      <p className="mt-4 text-lead text-ink-muted">{summary}</p>

      {(tags.length > 0 || links.length > 0) && (
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          {tags.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md bg-surface px-2 py-0.5 font-mono text-micro text-ink-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
          {links.length > 0 && (
            <ul className="flex gap-x-4 text-[0.9375rem]">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className="link">
                    {l.label} ↗<span className="sr-only"> {t('nuevaPestana')}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </header>
  )
}
