import { useTheme } from '../lib/useTheme'
import { useLang } from '../i18n/useLang'

/**
 * Dos estados, sin switch deslizante ni animacion de icono. El nombre accesible es
 * dinamico porque el boton describe la ACCION, no el estado actual.
 */
export function ThemeToggle(): React.JSX.Element {
  const { theme, toggle } = useTheme()
  const { t } = useLang()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? t('aClaro') : t('aOscuro')}
      title={isDark ? t('aClaro') : t('aOscuro')}
      className="inline-flex h-11 shrink-0 items-center text-meta text-ink-muted transition-colors duration-(--dur-state) hover:text-accent"
    >
      {/* El texto visible es la ACCION, no el estado: si dijera el estado actual
          ("oscuro") contradiria a su propio aria-label ("Cambiar a modo claro"). */}
      <span aria-hidden="true">{isDark ? t('temaClaro') : t('temaOscuro')}</span>
    </button>
  )
}
