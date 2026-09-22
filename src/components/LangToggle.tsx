import { useTranslation } from 'react-i18next'
import { useLang } from '../i18n/useLang'
import { type Lang } from '../i18n/lang'

/**
 * El conmutador de idioma.
 *
 * Es un BOTON, no un enlace, porque el idioma ya no vive en la URL: cambiarlo no navega a
 * ninguna parte, solo repinta la pagina en la que ya estas. Un enlace mentiria sobre lo que
 * va a pasar (abrir en otra pestana no llevaria al otro idioma) y ademas ensuciaria el
 * historial con entradas que no son paginas distintas.
 *
 * El texto visible es el ENDONIMO —el idioma escrito en su propia lengua—, que es la
 * convencion: "English" dentro de una pagina en castellano solo puede significar "pasar al
 * ingles". Por eso el rotulo y su nombre accesible se leen del idioma DESTINO, no del
 * actual, y por eso el boton lleva `lang` del destino: sin el, un lector de pantalla
 * pronunciaria "Espanol" con fonetica inglesa.
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
      className="inline-flex h-11 shrink-0 items-center spec-tag text-ink-muted transition-colors duration-(--dur-state) hover:text-accent"
    >
      {enDestino('cambiarIdioma')}
    </button>
  )
}
