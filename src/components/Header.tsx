import { Link, NavLink } from 'react-router-dom'
import { LangToggle } from './LangToggle'
import { ThemeToggle } from './ThemeToggle'
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
 */
export function Header(): React.JSX.Element {
  const { t } = useLang()

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-8 md:py-12">
      <Link
        to={RUTA_INICIO}
        aria-label={t('inicioAria')}
        className="font-medium tracking-tight text-ink transition-colors duration-(--dur-state) hover:text-accent"
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
              `rounded-md px-2 py-1 transition-colors duration-(--dur-state) hover:text-ink ${
                isActive && !item.to.includes('#') ? 'text-ink' : 'text-ink-muted'
              }`
            }
          >
            {t(item.label)}
          </NavLink>
        ))}
        <span aria-hidden="true" className="mx-1 h-4 w-px bg-rule" />
        <LangToggle />
        <ThemeToggle />
      </nav>
    </header>
  )
}
