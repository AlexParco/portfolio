import type { Decision } from '../data/types'
import { useLang } from '../i18n/useLang'
import type { ClaveUI } from '../i18n/ui'

const ROWS: { key: keyof Decision; label: ClaveUI }[] = [
  { key: 'problem', label: 'problema' },
  { key: 'choice', label: 'decision' },
  { key: 'tradeoff', label: 'tradeoff' },
]

/**
 * El registro de decision, como una ficha tecnica de tres campos: rotulo a la izquierda,
 * contenido a la derecha, celdas con borde. Es el mismo lenguaje que la rejilla del indice
 * —los huecos de 1px SON las lineas— para que el detalle no parezca otro sitio.
 *
 * El trade-off es el unico rotulo en tinta plena; los otros dos van atenuados. Es la fila
 * que importa: sin un precio explicito no hubo una decision, hubo una preferencia. Al ser
 * el sitio monocromo, ese enfasis lo da el BRILLO, no un color.
 */
export function DecisionRecord({ decision }: { decision: Decision }): React.JSX.Element {
  const { t, tr } = useLang()
  return (
    <div className="border border-rule bg-rule">
      <dl className="grid gap-px bg-rule">
        {ROWS.map(({ key, label }) => (
          <div
            key={key}
            className="grid gap-x-6 gap-y-2 bg-bg px-5 py-4 md:grid-cols-[8rem_minmax(0,1fr)]"
          >
            <dt className={`spec-tag ${key === 'tradeoff' ? 'text-ink' : 'text-ink-muted'}`}>
              {t(label)}
            </dt>
            <dd className="min-w-0 max-w-prose text-body text-ink-muted">{tr(decision[key])}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
