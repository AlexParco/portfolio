import type { ReactNode } from 'react'

/** Un apartado de portada: rotulo pequeno y discreto, y el contenido debajo. */
export function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}): React.JSX.Element {
  return (
    <section id={id} aria-labelledby={`${id}-t`} className="mt-16 scroll-mt-8">
      <h2 id={`${id}-t`} className="mb-4 text-[0.9375rem] font-medium text-ink-faint">
        {title}
      </h2>
      {children}
    </section>
  )
}
