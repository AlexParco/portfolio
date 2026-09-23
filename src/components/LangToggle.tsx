import { useTranslation } from 'react-i18next'
import { useLang } from '../i18n/useLang'
import { type Lang } from '../i18n/lang'

/**
 * El conmutador de idioma.
 *
 * Es un BOTON, no un enlace: el idioma no vive en la URL, cambiarlo no navega a ninguna
 * parte. El texto visible es el codigo del idioma DESTINO ("EN" dentro de la pagina en
 * castellano) y el nombre accesible va completo y en ese idioma, con su `lang`, para que
 * un lector de pantalla lo pronuncie con la fonetica correcta.
 */
export function LangToggle(): React.JSX.Element {
  const { lang, cambiar } = useLang()
  const { i18n } = useTranslation('ui')
  const otro: Lang = lang === 'es' ? 'en' : 'es'
  const enDestino = i18n.getFixedT(otro, 'ui')

  return (
    <button
      type="button"
      onClick={() => cambiar(otro)}
      lang={otro}
      aria-label={enDestino('verEnIdioma')}
      title={enDestino('verEnIdioma')}
      className="inline-flex h-9 min-w-9 items-center justify-center rounded-md px-1.5 font-mono text-meta text-ink-muted uppercase transition-colors duration-(--dur-state) hover:bg-bg-hover hover:text-ink"
    >
      {otro}
    </button>
  )
}
