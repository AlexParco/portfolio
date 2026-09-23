import { useTheme } from '../lib/useTheme'
import { useLang } from '../i18n/useLang'

/**
 * Un icono, dos estados. El nombre accesible describe la ACCION (a donde te lleva), no el
 * estado actual; por eso el icono tambien es el del destino: sol en oscuro, luna en claro.
 */
export function ThemeToggle(): React.JSX.Element {
  const { theme, toggle } = useTheme()
  const { t } = useLang()
  const isDark = theme === 'dark'
  const label = isDark ? t('aClaro') : t('aOscuro')

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="inline-flex size-9 items-center justify-center rounded-md text-ink-muted transition-colors duration-(--dur-state) hover:bg-bg-hover hover:text-ink"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        ) : (
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
        )}
      </svg>
    </button>
  )
}
