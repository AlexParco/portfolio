interface BlockProps {
  id: string
  label: string
  /** Dato al margen del titulo ("9 piezas", "2021 — 2026"). Opcional. */
  note?: string
  children: React.ReactNode
  active?: boolean
}

/**
 * Sustituye a la vieja `<Section>` y con ella a la reticula `etiqueta | contenido`.
 *
 * Aquella metia cada seccion en una canaleta lateral estrecha, y el efecto acumulado era
 * que el contenido nunca usaba mas de la mitad del ancho: la pagina entera se leia como
 * una columna con anotaciones al margen. Aqui el rotulo va ARRIBA y a todo lo ancho, con
 * su filete debajo — como la cabecera de una seccion de programa impreso—, y el contenido
 * dispone del ancho completo para organizarse en las columnas que necesite.
 *
 * El `note` de la derecha es lo que en un programa va junto al titulo del acto: cuantas
 * piezas hay, en que anos. Es dato, no adorno.
 */
export function Block({ id, label, note, children, active }: BlockProps): React.JSX.Element {
  return (
    <section id={id} data-active={active || undefined} className="mt-14 first:mt-0 md:mt-20">
      <div className="flex items-baseline justify-between gap-x-6 border border-rule bg-bg px-4 py-3">
        <h2 className="block-label spec-tag text-ink-muted">{label}</h2>
        {note && <p className="spec-tag text-ink-muted">{note}</p>}
      </div>
      {/* La separacion tras la caja vive AQUI, no en cada pagina: si la pone quien
          consume el bloque, se olvida en alguna y el contenido queda pegado. */}
      <div className="mt-6">{children}</div>
    </section>
  )
}
