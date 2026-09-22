import { Link } from 'react-router-dom'
import type { IndexItem } from '../lib/index-items'
import { useLang } from '../i18n/useLang'
import { formatYear } from '../lib/format'

/**
 * El indice como rejilla de celdas numeradas, igual que la lamina de pasos de una ficha
 * tecnica. Sustituye a la tabla de filas de la version anterior.
 *
 * El cambio no es solo de aspecto: en una tabla las nueve piezas se leen como una cola —una
 * detras de otra, y la primera parece la mas importante—. En rejilla se leen como un
 * conjunto, que es lo que son. El numero sigue dando el orden a quien lo quiera seguir.
 *
 * Cada celda ENTERA es el enlace, no solo el titulo: no hay links anidados que resolver, y
 * el area de pulsacion es la celda completa.
 */
export function IndexGrid({ items }: { items: IndexItem[] }): React.JSX.Element {
  const { lang, t } = useLang()

  return (
    <div className="border border-rule bg-rule">
      <div className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const body = (
            <>
              <div className="flex items-baseline justify-between gap-x-3">
                {/* El numero deja sitio a una flecha al pasar por encima. Se apilan en la
                    misma caja con `grid-area` compartida para que la celda no cambie de
                    ancho al intercambiarlos — si midieran distinto, la fila entera bailaria. */}
                <span className="grid spec-tag text-ink-muted">
                  <span className="col-start-1 row-start-1 transition-opacity duration-(--dur-state) group-hover:opacity-0 group-focus-visible:opacity-0">
                    {item.n}
                  </span>
                  <span
                    aria-hidden="true"
                    className="col-start-1 row-start-1 text-ink opacity-0 transition-opacity duration-(--dur-state) group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    ↗
                  </span>
                </span>
                <span className="spec-tag text-ink-muted">
                  {item.draft ? t('borrador') : t(item.kind)}
                </span>
              </div>

              <h3 className="mt-4 text-title text-ink transition-transform duration-200 ease-(--ease-out) group-hover:translate-x-1 group-focus-visible:translate-x-1">
                {item.title}
              </h3>
              <p className="mt-1.5 text-body text-ink-muted">{item.summary}</p>

              <div className="mt-4 flex items-baseline justify-between gap-x-3 border-t border-rule pt-2">
                <span className="spec-tag text-ink-muted">
                  {item.tags.slice(0, 2).join(' · ')}
                </span>
                <time dateTime={item.date} className="spec-tag text-ink-muted">
                  {formatYear(item.date, lang)}
                </time>
              </div>
            </>
          )

          // Una nota sin cuerpo no lleva enlace: seria una celda que no va a ninguna parte.
          return item.draft ? (
            <div key={item.href} className="flex flex-col bg-bg px-5 py-4">
              {body}
            </div>
          ) : (
            <Link
              key={item.href}
              to={item.href}
              className="group flex flex-col bg-bg px-5 py-4 no-underline transition-colors duration-(--dur-state) hover:bg-bg-hover focus-visible:bg-bg-hover"
            >
              {body}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
