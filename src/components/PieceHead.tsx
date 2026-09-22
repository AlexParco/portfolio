import { Link } from 'react-router-dom'
import { SpecGrid, SpecCell } from './Spec'
import { useLang } from '../i18n/useLang'
import { RUTA_INICIO } from '../i18n/lang'

export interface PieceLink {
  label: string
  href: string
}

/**
 * La cabecera de una ficha de detalle, con el mismo lenguaje que la portada: volver,
 * titulo grande, resumen, y una CAJA DE ESPECIFICACION con los metadatos.
 *
 * La caja sustituye a lo que antes eran tres cosas sueltas —la fecha en una linea, los
 * enlaces en otra y un bloque "Tags" con su propio rotulo—. En la portada esos datos ya
 * viven agrupados en la celda de cada pieza; repartirlos aqui obligaba a mirar en tres
 * sitios lo que en el indice se leia de un vistazo.
 *
 * Los enlaces a repo y demo van DENTRO de la caja, sobre el fold: la evidencia no se
 * entierra a un scroll de distancia.
 */
export function PieceHead({
  kind,
  title,
  summary,
  date,
  tags,
  links,
}: {
  kind: string
  title: string
  summary?: string
  date: string
  tags: string[]
  links: PieceLink[]
}): React.JSX.Element {
  const { t } = useLang()

  return (
    <header className="pt-2 md:pt-4">
      <Link
        to={RUTA_INICIO}
        className="spec-tag inline-flex min-h-11 items-center text-ink-muted underline underline-offset-4 transition-colors duration-(--dur-state) hover:text-ink"
      >
        {t('volver')}
      </Link>

      <h1 className="mt-6 max-w-[22ch] text-h1 text-ink">{title}</h1>

      {summary && <p className="mt-6 max-w-[52ch] text-lead text-ink-muted">{summary}</p>}

      <SpecGrid className="mt-10" cols="sm:grid-cols-2 lg:grid-cols-4">
        <SpecCell label={t('tipo')}>{kind}</SpecCell>
        <SpecCell label={t('fecha')}>{date}</SpecCell>
        <SpecCell label={tags.length > 1 ? t('stack') : t('tema')}>
          {tags.length > 0 ? tags.join(' · ') : '—'}
        </SpecCell>
        <SpecCell label={t('enlaces')}>
          {links.length > 0 ? (
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink underline"
                  >
                    {link.label} <span aria-hidden="true">↗</span>
                    <span className="sr-only">{t('nuevaPestana')}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            '—'
          )}
        </SpecCell>
      </SpecGrid>
    </header>
  )
}
