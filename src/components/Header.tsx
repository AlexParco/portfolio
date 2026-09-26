import { Link, NavLink } from 'react-router-dom'
import { LangToggle } from './LangToggle'
import { useLang } from '../i18n/useLang'
import { RUTA_INICIO } from '../i18n/lang'
import type { ClaveUI } from '../i18n/ui'

const NAV: { to: string; label: ClaveUI }[] = [
  { to: '/#proyectos', label: 'seccionProyectos' },
  { to: '/#notas', label: 'seccionNotas' },
  { to: '/about', label: 'sobreMi' },
]

/**
 * Una linea: el nombre a la izquierda y la navegacion a la derecha. Sin caja, sin filete:
 * en una columna de 42rem cualquier marco compite con el contenido.
 *
 * `overlay`: en la portada flota sobre la foto del hero, en crema fijo y sin ocupar sitio.
 */
export function Header({ overlay = false }: { overlay?: boolean }): React.JSX.Element {
  const { t } = useLang()
  const base = overlay ? 'text-cream-dim hover:text-cream' : 'text-ink-muted hover:text-ink'

  return (
    <header
      className={`${overlay ? 'absolute inset-x-0 top-0 z-10 mx-auto max-w-page px-5 sm:px-6' : ''} flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-8 md:py-12`}
    >
      <Link
        to={RUTA_INICIO}
        aria-label={t('inicioAria')}
        className={`font-medium tracking-tight transition-colors duration-(--dur-state) ${
          overlay ? 'text-cream' : 'text-ink hover:text-accent'
        }`}
      >
        Alexander Parco
      </Link>

      <nav aria-label={t('navPrincipal')} className="-mr-2 flex items-center gap-x-1 text-[0.9375rem]">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            // Los enlaces con ancla no deben marcarse activos en toda la portada.
            end
            className={({ isActive }) =>
              `rounded-md px-2 py-1 transition-colors duration-(--dur-state) ${
                isActive && !item.to.includes('#') ? (overlay ? 'text-cream' : 'text-ink') : base
              }`
            }
          >
            {t(item.label)}
          </NavLink>
        ))}
        <span aria-hidden="true" className={`mx-1 h-4 w-px ${overlay ? 'bg-cream/30' : 'bg-rule'}`} />
        <LangToggle overlay={overlay} />
      </nav>
    </header>
  )
}
