import { Link } from 'react-router-dom'
import { useLang } from '../i18n/useLang'

export interface NavTarget {
  href: string
  title: string
}

/** Anterior / siguiente al pie de un post, como en un blog. */
export function ArticleNav({
  prev,
  next,
}: {
  prev: NavTarget | null
  next: NavTarget | null
}): React.JSX.Element | null {
  const { t } = useLang()
  if (!prev && !next) return null

  const card = (target: NavTarget, label: string, align: 'left' | 'right') => (
    <Link
      to={target.href}
      className={`group flex flex-col gap-1 rounded-lg border border-rule px-4 py-3 transition-colors duration-(--dur-state) hover:border-ink-faint ${
        align === 'right' ? 'sm:col-start-2 sm:text-right' : ''
      }`}
    >
      <span className="text-[0.875rem] text-ink-faint">
        {align === 'left' ? `← ${label}` : `${label} →`}
      </span>
      <span className="text-ink transition-colors duration-(--dur-state) group-hover:text-accent">
        {target.title}
      </span>
    </Link>
  )

  return (
    <nav className="mt-16 grid gap-3 border-t border-rule pt-8 sm:grid-cols-2">
      {prev && card(prev, t('anterior'), 'left')}
      {next && card(next, t('siguiente'), 'right')}
    </nav>
  )
}
