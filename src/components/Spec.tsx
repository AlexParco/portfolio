/**
 * Las piezas de la ficha tecnica: rejillas de celdas con borde visible.
 *
 * El borde de 1px NO se pinta con `border` en cada celda —eso da lineas dobles donde dos
 * celdas se tocan—. Se pinta con `gap: 1px` sobre un fondo del color del filete: los huecos
 * de la rejilla SON las lineas. Una sola linea entre celdas, siempre, sin importar cuantas
 * haya ni como envuelvan.
 */
export function SpecGrid({
  children,
  className = '',
  cols = 'sm:grid-cols-2',
}: {
  children: React.ReactNode
  className?: string
  /** Clases de columnas de la rejilla. Se pasan enteras para que Tailwind las vea:
      construirlas por concatenacion (`sm:grid-cols-${n}`) hace que el compilador no
      encuentre la clase y la celda salga sin rejilla. */
  cols?: string
}): React.JSX.Element {
  return (
    <div className={`border border-rule bg-rule ${className}`}>
      <div className={`grid gap-px bg-rule ${cols}`}>{children}</div>
    </div>
  )
}

/** Una celda: rotulo diminuto en versalita y una o varias lineas de dato. */
export function SpecCell({
  label,
  children,
}: {
  label?: string
  children: React.ReactNode
}): React.JSX.Element {
  return (
    <div className="bg-bg px-4 py-3">
      {label && <p className="spec-tag text-ink-muted">{label}</p>}
      <div className="spec-tag text-ink">{children}</div>
    </div>
  )
}
