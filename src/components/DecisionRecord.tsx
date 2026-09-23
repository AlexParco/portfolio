import type { Decision } from '../data/types'
import { useLang } from '../i18n/useLang'
import type { ClaveUI } from '../i18n/ui'

const ROWS: { key: keyof Decision; label: ClaveUI }[] = [
  { key: 'problem', label: 'problema' },
  { key: 'choice', label: 'decision' },
  { key: 'tradeoff', label: 'tradeoff' },
]

/**
 * El registro de decision como un recuadro de lectura rapida, antes del cuerpo: problema,
 * que se eligio y el precio. El trade-off lleva la marca de acento porque es la fila que
 * importa: sin un precio explicito no hubo una decision, hubo una preferencia.
 */
export function DecisionRecord({ decision }: { decision: Decision }): React.JSX.Element {
  const { t, tr } = useLang()
  return (
    <dl className="flex flex-col gap-y-5 rounded-xl bg-surface p-5 sm:p-6">
      {ROWS.map(({ key, label }) => (
        <div key={key}>
          <dt
            className={`text-[0.875rem] font-medium ${key === 'tradeoff' ? 'text-accent' : 'text-ink'}`}
          >
            {t(label)}
          </dt>
          <dd className="mt-1 text-[0.9375rem] leading-relaxed text-ink-muted">{tr(decision[key])}</dd>
        </div>
      ))}
    </dl>
  )
}
