import type { JSX } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
import { RUTA_INICIO } from '../i18n/lang'

export function NotFound(): JSX.Element {
  const { t } = useLang()

  return (
    <section className="py-16">
      <p className="font-mono text-meta text-ink-faint">404</p>
      <h1 className="mt-3 text-h1 text-ink">{t('noExiste')}</h1>
      <Link to={RUTA_INICIO} className="link mt-6 inline-block">
        {t('inicio')}
      </Link>
    </section>
  )
}
