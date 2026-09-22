import { Prose } from './Prose'
import { encabezados } from '../lib/headings'
import { useLang } from '../i18n/useLang'

/**
 * El cuerpo de una ficha: la prosa a la izquierda y su indice de apartados al margen.
 *
 * La prosa NO se estira a todo el ancho a proposito. A 15px, una linea de 1120px son unos
 * 110 caracteres, y por encima de ~75 el ojo pierde el renglon al saltar de linea: se
 * relee la misma o se salta una. Por eso la medida se queda en 68ch.
 *
 * Lo que si era un problema es que ese margen quedaba VACIO, y una columna corta dentro de
 * una caja ancha se lee como un fallo de maquetado en vez de como una decision. El indice
 * lo ocupa y ademas sirve: en una nota larga dice de un vistazo que hay dentro.
 *
 * Si la pieza tiene menos de dos apartados no se pinta indice —un indice de un solo punto
 * no informa de nada— y la prosa se queda sola.
 */
export function Reading({ children }: { children: string }): React.JSX.Element {
  const { t } = useLang()
  const items = encabezados(children)

  if (items.length < 2) return <Prose>{children}</Prose>

  return (
    <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,13rem)] lg:items-start">
      <div className="min-w-0">
        <Prose>{children}</Prose>
      </div>

      <nav aria-label={t('apartados')} className="lg:sticky lg:top-8">
        <p className="spec-tag border-b border-rule pb-2 text-ink-muted">{t('apartados')}</p>
        <ul className="mt-3 flex flex-col gap-y-2">
          {items.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className="text-micro text-ink-muted no-underline transition-colors duration-(--dur-state) hover:text-ink hover:underline"
              >
                {h.texto}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
