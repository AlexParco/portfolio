import { useEffect, useRef, useState } from 'react'

/**
 * Un aro que sigue al puntero con retardo. Rodea al cursor: NO lo sustituye — el cursor
 * nativo sigue visible. Ocultarlo obligaria a reimplementar sus estados (texto, puntero,
 * redimensionado) y cualquier fallo del aro dejaria al usuario sin cursor.
 *
 * Solo se monta con puntero FINO y con hover disponible: en tactil no hay cursor al que
 * rodear, y el aro se quedaria clavado donde se toco por ultima vez.
 *
 * El seguimiento es una interpolacion hacia la posicion real (lerp 0.18), no un salto: el
 * retardo es todo el efecto. Se anima `transform` y nada mas, asi que el trabajo se queda
 * en el compositor y no dispara relayouts.
 */
const SIZE = 32
const EASE = 0.18

export function CursorRing(): React.JSX.Element | null {
  const ref = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    const ok = fine.matches && !still.matches
    setEnabled(ok)
    if (!ok) return

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const at = { ...target }
    let frame = 0
    let visible = false
    let pressed = false
    let over = false
    // La escala tambien se INTERPOLA. Antes saltaba porque la clase llevaba
    // `transition-[scale]` y aqui se escribe `transform: ... scale()`: la transicion CSS de
    // la propiedad `scale` no afecta a la funcion scale() dentro de `transform`, asi que el
    // cambio era instantaneo aunque pareciera animado en el codigo.
    let scale = 1

    const el = () => ref.current
    const ripples = new Set<HTMLElement>()

    const move = (e: PointerEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      if (!visible) {
        // Hasta el primer movimiento no se pinta: si no, aparece un aro parado en el
        // centro de la pantalla antes de que el usuario toque el raton.
        visible = true
        at.x = target.x
        at.y = target.y
        const node = el()
        if (node) node.style.opacity = '1'
      }
      // El aro crece sobre lo que se puede pulsar: hace de indicador de objetivo, que es
      // trabajo util y no solo decoracion.
      over = Boolean((e.target as Element | null)?.closest('a, button'))
    }

    const leave = () => {
      const node = el()
      if (node) node.style.opacity = '0'
      visible = false
    }

    /** Onda al pulsar: un aro que sale del punto del clic y se desvanece. */
    const down = (e: PointerEvent) => {
      pressed = true

      const wave = document.createElement('div')
      wave.className = 'pointer-events-none fixed z-50 rounded-full border border-ink-muted'
      wave.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${SIZE}px;height:${SIZE}px;margin:${-SIZE / 2}px 0 0 ${-SIZE / 2}px`
      document.body.appendChild(wave)
      ripples.add(wave)

      const anim = wave.animate(
        [
          { transform: 'scale(0.9)', opacity: 0.9 },
          { transform: 'scale(2.8)', opacity: 0 },
        ],
        { duration: 520, easing: 'cubic-bezier(0.2, 0, 0, 1)' },
      )
      // Se limpia sola: si no, cada clic deja un nodo muerto en el <body> para siempre.
      anim.onfinish = () => {
        wave.remove()
        ripples.delete(wave)
      }
    }

    const up = () => {
      pressed = false
    }

    const loop = () => {
      at.x += (target.x - at.x) * EASE
      at.y += (target.y - at.y) * EASE

      // Pulsar encoge; encima de un enlace agranda. El pulsado manda sobre el hover.
      const wanted = (over ? 1.9 : 1) * (pressed ? 0.7 : 1)
      scale += (wanted - scale) * 0.22

      const node = el()
      if (node) {
        node.style.transform = `translate3d(${at.x - SIZE / 2}px, ${at.y - SIZE / 2}px, 0) scale(${scale})`
      }
      frame = requestAnimationFrame(loop)
    }

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down, { passive: true })
    // En `window` y no en el aro: el aro tiene `pointer-events: none` y nunca recibe eventos.
    window.addEventListener('pointerup', up, { passive: true })
    window.addEventListener('pointercancel', up, { passive: true })
    document.addEventListener('pointerleave', leave)
    frame = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
      document.removeEventListener('pointerleave', leave)
      // Una onda a medio animar sobrevive al desmontaje si no se barre aqui.
      for (const wave of ripples) wave.remove()
      ripples.clear()
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 rounded-full border border-ink-muted opacity-0 transition-opacity duration-200 ease-out"
      style={{ width: SIZE, height: SIZE, willChange: 'transform' }}
    />
  )
}
