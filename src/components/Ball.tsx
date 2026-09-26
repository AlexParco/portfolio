import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
import { type Solido, sol, solidos } from '../lib/sol'

/**
 * El sol del hero: un circulo que se agarra y se lanza por la pantalla.
 *
 * Estados:
 *   docked → pegado al ancla `#sol` del hero (se desplaza con la pagina). Fuera de la
 *            portada no se ve.
 *   drag   → sigue al puntero.
 *   free   → fisica: gravedad, rebote en los bordes del viewport y rozamiento.
 *   rest   → quieto donde cayo. En el suelo se queda en el viewport aunque cambies de
 *            pagina; encima de un solido (una letra del nombre) se queda PEGADO a el y se
 *            desplaza con la pagina.
 *
 * Choca con los `solidos` publicados en lib/sol.ts (hoy, las letras del nombre): rebota
 * segun la cara que golpea y le avisa al solido para que reaccione.
 *
 * Mientras se mueve, "toca" lo que lleva `data-ball` (filas de proyectos, notas...): la
 * fila se ilumina un instante. Si toca `data-ball-goal` (el pie) lanza `ball:goal`.
 *
 * Todo va por refs y un solo requestAnimationFrame, sin estado de React: re-renderizar a
 * 60 fps un componente por cada frame de fisica no tiene sentido.
 *
 * Con `prefers-reduced-motion` se puede arrastrar y soltar, pero sin inercia ni rebotes.
 */

const R = 15 // radio en px
const G = 2400 // gravedad, px/s²
const E = 0.72 // restitucion del rebote
const MAX_V = 4200

type Mode = 'docked' | 'drag' | 'free' | 'rest'

export function Ball(): React.JSX.Element {
  const { pathname } = useLocation()
  const { t } = useLang()
  const ref = useRef<HTMLButtonElement>(null)
  const home = useRef(pathname === '/')
  home.current = pathname === '/'

  const st = useRef({
    mode: 'docked' as Mode,
    x: -100,
    y: -100,
    vx: 0,
    vy: 0,
    dx: 0,
    dy: 0,
    moved: 0,
    samples: [] as { x: number; y: number; t: number }[],
    squash: 0,
    squashAxis: 'y' as 'x' | 'y',
    touching: new Set<Element>(),
    // Ultimo toque por elemento. El respingo mueve la fila unos px; sin esta espera el
    // borde entra y sale del sol y el toque se redispara en bucle.
    lastHit: new WeakMap<Element, number>(),
    goal: false,
    /** Sobre que solido esta sentado en reposo, y en que punto relativo a su esquina. */
    apoyo: null as { id: string; dx: number; dy: number } | null,
  })

  const reduced = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.current = mq.matches
    const onChange = () => (reduced.current = mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const s = st.current
    let last = performance.now()
    let frame = 0
    // Solo en desarrollo: para poder inspeccionar la fisica desde la consola o un test.
    if (import.meta.env.DEV) Object.assign(window, { __sol: { estado: s, solidos } })

    const viewport = () => ({
      w: document.documentElement.clientWidth,
      h: window.innerHeight,
    })

    const hit = (target: HTMLElement) => {
      target.style.setProperty('--kick', `${Math.sign(s.vx || 1) * 4}px`)
      target.classList.remove('ball-hit')
      void target.offsetWidth // reinicia la animacion si ya estaba corriendo
      target.classList.add('ball-hit')
      window.setTimeout(() => target.classList.remove('ball-hit'), 900)
    }

    const overlaps = (r: DOMRect) => {
      const cx = Math.max(r.left, Math.min(s.x, r.right))
      const cy = Math.max(r.top, Math.min(s.y, r.bottom))
      return (s.x - cx) ** 2 + (s.y - cy) ** 2 < R * R
    }

    const touch = () => {
      const now = new Set<Element>()
      for (const target of document.querySelectorAll<HTMLElement>('[data-ball]')) {
        if (!overlaps(target.getBoundingClientRect())) continue
        now.add(target)
        const t0 = performance.now()
        if (!s.touching.has(target) && t0 - (s.lastHit.get(target) ?? 0) > 900) {
          s.lastHit.set(target, t0)
          hit(target)
        }
      }
      s.touching = now

      if (!s.goal) {
        // La porteria es toda la FRANJA del pie, de borde a borde: el sol suele acabar
        // rodando hasta un lado, fuera de la columna de 42rem.
        const goal = document.querySelector('[data-ball-goal]')
        const r = goal?.getBoundingClientRect()
        if (r && overlaps(new DOMRect(0, r.top, viewport().w, r.height))) {
          s.goal = true
          window.dispatchEvent(new CustomEvent('ball:goal'))
        }
      }
    }

    const impact = (v: number, axis: 'x' | 'y') => {
      if (Math.abs(v) > 250) {
        s.squash = Math.min(0.32, Math.abs(v) / 5000)
        s.squashAxis = axis
      }
    }

    const todosLosSolidos = (): Solido[] => [...solidos.values()].flat()

    /**
     * Circulo contra caja: el punto de la caja mas cercano al centro del sol. Si esta a
     * menos de R, hay choque: se saca al sol por la normal y se refleja la velocidad.
     * Devuelve el solido sobre el que queda apoyado (normal hacia arriba), si lo hay.
     */
    const chocar = (): Solido | null => {
      let apoyo: Solido | null = null
      for (const b of todosLosSolidos()) {
        const cx = Math.max(b.l, Math.min(s.x, b.r))
        const cy = Math.max(b.t, Math.min(s.y, b.b))
        let nx = s.x - cx
        let ny = s.y - cy
        let d = Math.hypot(nx, ny)
        if (d >= R) continue

        if (d === 0) {
          // El centro quedo DENTRO de la caja: se sale por la cara mas cercana.
          const salidas = [
            { d: s.x - b.l, nx: -1, ny: 0 },
            { d: b.r - s.x, nx: 1, ny: 0 },
            { d: s.y - b.t, nx: 0, ny: -1 },
            { d: b.b - s.y, nx: 0, ny: 1 },
          ].sort((a, c) => a.d - c.d)[0]
          nx = salidas.nx
          ny = salidas.ny
          d = -salidas.d
        } else {
          nx /= d
          ny /= d
        }

        s.x += nx * (R - d)
        s.y += ny * (R - d)

        const vn = s.vx * nx + s.vy * ny
        if (vn < 0) {
          b.golpe(s.vx, s.vy, nx, ny)
          impact(vn, Math.abs(ny) > Math.abs(nx) ? 'y' : 'x')
          s.vx -= (1 + E) * vn * nx
          s.vy -= (1 + E) * vn * ny
          // Un poco de rozamiento en la cara, para que no patine eternamente.
          s.vx *= 0.96
        }
        if (ny < -0.7) apoyo = b
      }
      return apoyo
    }

    const step = (dt: number) => {
      const { w, h } = viewport()

      // Subpasos: a 4000 px/s el sol avanza ~70 px por frame y atravesaria una letra de
      // un salto. Se parte el frame para que nunca avance mas de ~R/2 de golpe.
      const pasos = Math.min(12, Math.max(1, Math.ceil((Math.hypot(s.vx, s.vy) * dt) / (R / 2))))
      const paso = dt / pasos
      let apoyo: Solido | null = null

      for (let i = 0; i < pasos; i++) {
        s.vy += G * paso
        s.vx *= 1 - 0.25 * paso
        s.x += s.vx * paso
        s.y += s.vy * paso
        apoyo = chocar() ?? apoyo
      }

      if (s.y + R > h) {
        s.y = h - R
        if (s.vy > 0) {
          impact(s.vy, 'y')
          s.vy = -s.vy * E
          s.vx *= 0.92
        }
        if (Math.abs(s.vy) < 90) s.vy = 0
      }
      if (s.y - R < 0) {
        s.y = R
        if (s.vy < 0) {
          impact(s.vy, 'y')
          s.vy = -s.vy * E
        }
      }
      if (s.x + R > w) {
        s.x = w - R
        if (s.vx > 0) {
          impact(s.vx, 'x')
          s.vx = -s.vx * E
        }
      }
      if (s.x - R < 0) {
        s.x = R
        if (s.vx < 0) {
          impact(s.vx, 'x')
          s.vx = -s.vx * E
        }
      }

      // Encima de una letra: igual que en el suelo, con rebotes cada vez mas pequenos
      // hasta quedarse sentado.
      if (apoyo && Math.abs(s.vy) < 120) {
        s.vy = 0
        s.vx *= 1 - 3 * dt
        if (Math.abs(s.vx) < 6) {
          s.vx = 0
          s.mode = 'rest'
          s.apoyo = { id: apoyo.id, dx: s.x - apoyo.l, dy: s.y - apoyo.t }
        }
        return
      }

      // Rodando por el suelo: rozamiento fuerte hasta pararse.
      const onFloor = s.vy === 0 && s.y >= h - R - 0.5
      if (onFloor) {
        s.vx *= 1 - 3 * dt
        if (Math.abs(s.vx) < 6) {
          s.vx = 0
          s.mode = 'rest'
          s.apoyo = null
        }
      }
    }

    const render = () => {
      const sq = s.squash
      const [sx, sy] = s.squashAxis === 'y' ? [1 + sq, 1 - sq] : [1 - sq, 1 + sq]
      el.style.transform = `translate3d(${s.x - R}px, ${s.y - R}px, 0) scale(${sx}, ${sy})`
    }

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30)
      last = now

      if (s.mode === 'docked') {
        const anchor = home.current ? document.getElementById('sol') : null
        el.style.visibility = anchor ? 'visible' : 'hidden'
        el.dataset.docked = ''
        if (anchor) {
          const r = anchor.getBoundingClientRect()
          s.x = r.left + r.width / 2
          s.y = r.top + r.height / 2
        }
      } else {
        el.style.visibility = 'visible'
        delete el.dataset.docked
        if (s.mode === 'free') {
          step(dt)
          touch()
        } else if (s.mode === 'drag') {
          touch()
        } else if (s.apoyo) {
          // Sentado en una letra: va pegado a ella (se desplaza con el scroll). Si la letra
          // ya no existe (se cambio de pagina), el sol se cae.
          const b = todosLosSolidos().find((x) => x.id === s.apoyo?.id)
          if (b) {
            s.x = b.l + s.apoyo.dx
            s.y = b.t + s.apoyo.dy
          } else {
            s.apoyo = null
            s.mode = 'free'
          }
          touch()
        } else {
          // Quieto en el suelo: si la ventana encoge, que no se quede fuera.
          const { w, h } = viewport()
          s.x = Math.min(Math.max(s.x, R), w - R)
          s.y = Math.min(Math.max(s.y, R), h - R)
          touch()
        }
      }

      s.squash *= 0.82
      render()

      // Publica la posicion para el resto de la pagina (el nombre del hero la usa).
      if (dt > 0) {
        sol.vx = (s.x - sol.x) / dt
        sol.vy = (s.y - sol.y) / dt
      }
      sol.x = s.x
      sol.y = s.y
      sol.visible = el.style.visibility === 'visible'
      frame = requestAnimationFrame(loop)
    }

    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])

  const release = () => {
    const s = st.current
    s.goal = false
    if (reduced.current) {
      s.mode = 'rest'
      return
    }
    // Velocidad del lanzamiento: solo con lo que se movio en los ULTIMOS 90 ms. Si lo
    // sostuviste quieto antes de soltar, no hay muestras recientes y cae sin impulso (antes
    // se usaba la primera muestra del arrastre y salia disparado aunque lo soltaras quieto).
    const now = performance.now()
    const recientes = s.samples.filter((p) => now - p.t < 90)
    const old = recientes[0]
    const lastP = recientes[recientes.length - 1]
    if (old && lastP && lastP.t > old.t) {
      const dt = (lastP.t - old.t) / 1000
      s.vx = Math.max(-MAX_V, Math.min(MAX_V, (lastP.x - old.x) / dt))
      s.vy = Math.max(-MAX_V, Math.min(MAX_V, (lastP.y - old.y) / dt))
    } else {
      s.vx = 0
      s.vy = 0
    }
    // Un clic sin arrastrar: un saltito, para que se note que se puede jugar con el.
    if (s.moved < 4) {
      s.vx = (Math.random() - 0.5) * 900
      s.vy = -1100
    }
    s.mode = 'free'
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={t('pelota')}
      title={t('pelota')}
      className="ball"
      onPointerDown={(e) => {
        const s = st.current
        e.currentTarget.setPointerCapture(e.pointerId)
        s.mode = 'drag'
        s.apoyo = null
        s.dx = e.clientX - s.x
        s.dy = e.clientY - s.y
        s.moved = 0
        s.samples = [{ x: s.x, y: s.y, t: performance.now() }]
      }}
      onPointerMove={(e) => {
        const s = st.current
        if (s.mode !== 'drag') return
        const nx = e.clientX - s.dx
        const ny = e.clientY - s.dy
        s.moved += Math.hypot(nx - s.x, ny - s.y)
        s.x = nx
        s.y = ny
        s.samples.push({ x: nx, y: ny, t: performance.now() })
        if (s.samples.length > 8) s.samples.shift()
      }}
      onPointerUp={() => {
        if (st.current.mode === 'drag') release()
      }}
      onPointerCancel={() => {
        if (st.current.mode === 'drag') release()
      }}
      onClick={(e) => {
        // detail === 0: activado con teclado (Enter/Espacio), no con el puntero.
        if (e.detail !== 0 || reduced.current) return
        const s = st.current
        s.goal = false
        s.vx = (Math.random() < 0.5 ? -1 : 1) * (600 + Math.random() * 900)
        s.vy = -1500
        s.apoyo = null
        s.mode = 'free'
      }}
    />
  )
}
