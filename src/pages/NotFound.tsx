import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
import { RUTA_INICIO } from '../i18n/lang'

export function NotFound(): JSX.Element {
  const { t } = useLang()

  return (
    <section className="py-10 md:py-16">
      <span aria-hidden="true" className="mark-bar" />
      <h1 className="mt-6 text-h1 text-ink">404</h1>
      <p className="mt-4 text-body text-ink-muted">{t('noExiste')}</p>
      <Link
        to={RUTA_INICIO}
        className="mt-2 inline-flex min-h-11 items-center text-meta text-accent underline-offset-4 hover:underline"
      >
        {t('inicio')}
      </Link>
    </section>
  )
}
