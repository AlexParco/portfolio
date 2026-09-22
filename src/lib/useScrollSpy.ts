import { useEffect, useState } from 'react'

/**
 * Devuelve el id de la seccion que cruza la franja central del viewport.
 * Cadena vacia si ninguna la cruza (p. ej. arriba del todo, en el hero).
 *
 * `resetKey` reconstruye el observer cuando los nodos observados cambian sin que
 * cambien los ids. Es imprescindible en Nav: Nav no se desmonta nunca, pero
 * <main key={pathname}> destruye y recrea las secciones en cada navegacion, y el
 * observer se quedaria mirando nodos huerfanos.
 */
export function useScrollSpy(ids: string[], resetKey = ''): string {
  const [active, setActive] = useState('')
  // Los ids llegan como literal en cada render: se comparan por valor, no por referencia.
  const key = ids.join(',')

  useEffect(() => {
    const targets = key
      .split(',')
      .filter(Boolean)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (targets.length === 0) {
      setActive('')
      return
    }

    const visible = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio)
          else visible.delete(entry.target.id)
        }

        let winner = ''
        let best = -1
        for (const [id, ratio] of visible) {
          if (ratio > best) {
            winner = id
            best = ratio
          }
        }
        setActive(winner)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    for (const target of targets) observer.observe(target)
    return () => observer.disconnect()
  }, [key, resetKey])

  return active
}
