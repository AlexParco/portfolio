import { useLang } from '../i18n/useLang'

/**
 * Diagrama ASCII del sistema. Es texto, no una imagen: se puede seleccionar, buscar y leer
 * con un lector de pantalla, y no tiene coste de descarga ni salto de layout.
 *
 * tabIndex={0}: la caja hace scroll horizontal en pantallas estrechas, y una region con
 * scroll debe ser alcanzable por teclado o su contenido solo se lee con raton.
 */
export function Diagram({ children }: { children: string }): React.JSX.Element {
  const { t } = useLang()

  return (
    <figure>
      <pre
        tabIndex={0}
        role="region"
        aria-label={t('diagramaArquitectura')}
        className="overflow-x-auto rounded-sharp border border-rule bg-surface p-5 text-micro leading-[1.55] text-ink-muted [tab-size:2]"
      >
        {children}
      </pre>
    </figure>
  )
}
