import { Fragment, useEffect, useRef } from 'react'
import { type Solido, sol, solidos } from '../lib/sol'

/**
 * El nombre del hero, vivo, atado al sol del paisaje:
 *
 *  - Luz del sol: cuanto mas cerca esta el sol de una letra, mas calida y brillante. Si lo
 *    lanzas lejos, el nombre se apaga un poco.
 *
 * Y ademas son SOLIDAS: el sol choca con ellas (ver `solidos` en lib/sol.ts). La letra
 * golpeada se hunde un poco y se inclina hacia donde la empujaron, y vuelve con su resorte.
 *
 * Se quitaron dos efectos que hubo: una sombra larga proyectada en contra del sol (sobre
 * la foto ensuciaba las letras) y un "viento" que mecia las letras al pasar el puntero y en
 * reposo (distraia). El nombre solo se mueve cuando el sol lo golpea.
 *
 * El texto real va en un `sr-only`; las letras sueltas son `aria-hidden`: un lector de
 * pantalla leeria "A, l, e, x..." si se partiera el nombre sin mas.
 *
 * Todo corre en un solo requestAnimationFrame que escribe variables CSS por letra; el
 * aspecto (color, halo, hundimiento y giro por golpe) lo resuelve `.nombre-letra` en theme.css. El bucle se
 * detiene cuando el nombre sale de pantalla.
 */

const K = 70 // rigidez del resorte del giro de cada letra
const C = 7 // amortiguacion
const MAX_ROT = 12 // grados

export function HeroName({ name, id }: { name: string; id: string }): React.JSX.Element {
  const h1 = useRef<HTMLHeadingElement>(null)
  const words = name.split(' ')

  useEffect(() => {
    const root = h1.current
    if (!root) return
    const letters = Array.from(root.querySelectorAll<HTMLElement>('.nombre-letra'))
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Centro de cada letra y caja REAL de su glifo, relativos al h1. Con offsetLeft/Top y
    // no con getBoundingClientRect: el giro de la propia letra no debe mover lo medido.
    //
    // La caja del <span> no sirve para chocar: mide lo mismo para la "A" que para la "e",
    // con todo el hueco de encima de las minusculas. La del glifo sale de canvas
    // `measureText`, que da cuanto sube y baja cada caracter respecto a la linea base.
    let centers: { x: number; y: number }[] = []
    let glifos: { l: number; t: number; r: number; b: number }[] = []
    const ctx = document.createElement('canvas').getContext('2d')
    const medir = () => {
      const cs = getComputedStyle(root)
      const fs = parseFloat(cs.fontSize)
      const lh = parseFloat(cs.lineHeight) || fs
      if (ctx) ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
      centers = letters.map((l) => ({
        x: l.offsetLeft - root.offsetLeft + l.offsetWidth / 2,
        y: l.offsetTop - root.offsetTop + l.offsetHeight / 2,
      }))
      glifos = letters.map((l) => {
        const x0 = l.offsetLeft - root.offsetLeft
        const y0 = l.offsetTop - root.offsetTop
        const m = ctx?.measureText(l.textContent ?? '')
        if (!m) return { l: x0, t: y0, r: x0 + l.offsetWidth, b: y0 + l.offsetHeight }
        // Linea base dentro de la caja de linea: medio interlineado + ascendente de la fuente.
        const base = y0 + (lh - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent
        return {
          l: x0 - m.actualBoundingBoxLeft,
          r: x0 + m.actualBoundingBoxRight,
          t: base - m.actualBoundingBoxAscent,
          b: base + m.actualBoundingBoxDescent,
        }
      })
    }
    medir()
    void document.fonts?.ready.then(medir)
    const ro = new ResizeObserver(medir)
    ro.observe(root)

    const rot = letters.map(() => 0)
    const vel = letters.map(() => 0)
    // Hundimiento vertical (px) por los golpes del sol, con su propio resorte.
    const baja = letters.map(() => 0)
    const vbaja = letters.map(() => 0)

    // Lo que le pasa a una letra cuando el sol la golpea. `nx, ny` apunta de la letra al
    // sol: si le cae encima (ny < 0) se hunde; y se inclina segun hacia donde iba el sol.
    const golpe = (i: number) => (vx: number, vy: number, nx: number, ny: number) => {
      const fuerza = Math.abs(vx * nx + vy * ny)
      vbaja[i] += -ny * fuerza * 0.22
      if (!reduced) vel[i] += vx * 0.05 - nx * fuerza * 0.04
    }
    const golpes = letters.map((_, i) => golpe(i))

    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(root)

    let frame = 0
    let last = performance.now()
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now
      const r = root.getBoundingClientRect()

      // Los solidos se publican SIEMPRE, aunque el nombre este fuera de pantalla: si el
      // sol esta sentado en una letra, tiene que poder seguirla al hacer scroll.
      solidos.set(
        'nombre',
        glifos.map<Solido>((g, i) => ({
          id: `nombre-${i}`,
          l: r.left + g.l,
          t: r.top + g.t + baja[i],
          r: r.left + g.r,
          b: r.top + g.b + baja[i],
          golpe: golpes[i],
        })),
      )

      if (!visible) return

      letters.forEach((el, i) => {
        const lx = r.left + centers[i].x
        const ly = r.top + centers[i].y

        // ── Luz ─────────────────────────────────────────────────────────
        let luz = 0.35
        if (sol.visible) {
          const dist = Math.hypot(lx - sol.x, ly - sol.y) || 1
          luz = Math.max(0, 1 - dist / 1100) ** 1.4

        }

        // ── Hundimiento por golpe: resorte rigido, vuelve rapido ─────────
        vbaja[i] += (-260 * baja[i] - 16 * vbaja[i]) * dt
        baja[i] = Math.max(-8, Math.min(10, baja[i] + vbaja[i] * dt))

        // ── Giro por golpe: resorte amortiguado, vuelve a 0 ─────────────
        vel[i] += (-K * rot[i] - C * vel[i]) * dt
        rot[i] = Math.max(-MAX_ROT, Math.min(MAX_ROT, rot[i] + vel[i] * dt))
        const giro = rot[i]

        el.style.setProperty('--luz', luz.toFixed(3))
        el.style.setProperty('--rot', `${giro.toFixed(2)}deg`)
        el.style.setProperty('--baja', `${baja[i].toFixed(2)}px`)
      })
    }
    frame = requestAnimationFrame(loop)

    return () => {
      solidos.delete('nombre')
      cancelAnimationFrame(frame)
      ro.disconnect()
      io.disconnect()
    }
  }, [name])

  let n = 0
  return (
    <h1
      ref={h1}
      id={id}
      // Siempre en UNA linea. El nombre mide ~10,6 veces su tamano de letra (medido con
      // Geist, letras sueltas); el tamano se calcula para que quepa en la columna con margen
      // para el balanceo: (ancho de pantalla - gutters) / 10,9, con techo de 3.5rem, que es
      // lo que cabe en la columna de 42rem.
      className="nombre mt-3 text-[clamp(1.5rem,calc((100vw-2.5rem)/10.9),3.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] whitespace-nowrap"
    >
      <span className="sr-only">{name}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          // El espacio va FUERA del bloque de cada palabra: dentro de un inline-block el
          // espacio final se descarta y las palabras quedarian pegadas.
          <Fragment key={w}>
            {w > 0 && ' '}
            <span className="inline-block whitespace-nowrap">
              {[...word].map((ch) => (
                <span key={n++} className="nombre-letra">
                  {ch}
                </span>
              ))}
            </span>
          </Fragment>
        ))}
      </span>
    </h1>
  )
}
