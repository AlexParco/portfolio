import { education, experience } from '../data/experience'
import { formatYearRange } from '../lib/format'
import { useLang } from '../i18n/useLang'

/**
 * Trayectoria y formacion en una ficha compacta al margen del perfil: donde, que, cuando.
 *
 * Antes cada empleo ocupaba un bloque con resumen y hasta tres vinetas, y entre los cuatro
 * empujaban el indice —lo unico que alguien viene a ver— muy por debajo del pliegue. Aqui
 * el historial es lo que es en un programa impreso: una ficha al margen, no el acto
 * principal. El detalle de cada puesto vive en el CV, que se descarga desde la cabecera.
 *
 * Dos LINEAS por fila, no tres columnas: la ficha vive en una columna de 20rem y ahi tres
 * columnas parten "Proyectos propios" y "Diseno y Desarrollo de Software" en escalera.
 */
function Row({
  place,
  role,
  range,
}: {
  place: string
  role: string
  range: string
}): React.JSX.Element {
  return (
    <li className="border-b border-rule py-3 last:border-b-0">
      <div className="flex items-baseline justify-between gap-x-4">
        <span className="text-body text-ink">{place}</span>
        <time className="shrink-0 font-mono text-micro whitespace-nowrap text-ink-muted">
          {range}
        </time>
      </div>
      <p className="mt-0.5 font-mono text-micro text-ink-muted">{role}</p>
    </li>
  )
}

export function Ledger(): React.JSX.Element {
  const { lang, tr } = useLang()
  const jobs = [...experience].sort((a, b) => b.start.localeCompare(a.start))

  return (
    <ul>
      {jobs.map((job) => (
        <Row
          key={`${job.company}-${job.start}`}
          place={job.company}
          role={tr(job.role)}
          range={formatYearRange(job.start, job.end, lang)}
        />
      ))}
      {education.map((study) => (
        <Row
          key={`${study.institution}-${study.start}`}
          place={study.institution}
          role={`${study.status} · ${study.program}`}
          range={formatYearRange(study.start, study.end, lang)}
        />
      ))}
    </ul>
  )
}
