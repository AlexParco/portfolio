import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { crearGoldfish } from './goldfish'

/**
 * NO se usa en el sitio: el pez se retiro de la pagina y este archivo vive en el laboratorio.
 * Se conserva porque el PATRON DE NADO —deriva del rumbo, viraje suave en los bordes y
 * rafagas de velocidad, con los tres parametros ajustados por simulacion— si funcionaba, y
 * hay que portarlo al pez en SVG. Borrarlo obligaria a redescubrir esos ajustes.
 *
 * El pez nadando por encima de la pagina.
 *
 * Va en un <canvas> fijo a pantalla completa, transparente y sin capturar eventos. La
 * camara es ORTOGRAFICA: con perspectiva el pez cambiaria de tamano segun se acerca al
 * centro de la pantalla, que en una pagina plana se lee como un error de escala, no como
 * profundidad.
 *
 * Todo el modulo —y con el, Three.js— se carga en diferido: son ~150 KB gzip y la portada
 * no tiene por que esperarlos para pintar.
 */
const ALTO_MUNDO = 10 // unidades de mundo que abarca el alto del viewport
// A 1.45 el pez tardaba unos 12 s en cruzar y parecia ir a la deriva. A 3.4 cruza en ~5 s,
// que es el ritmo al que se lee como un pez nadando y no como un globo flotando.
const VELOCIDAD = 3.4 // unidades por segundo, en crucero
const GIRO_MAX = 2.0 // radianes por segundo: por encima, los giros parecen teledirigidos
// Estos tres estan AJUSTADOS POR SIMULACION, no a ojo: con los valores iniciales
// (margen 1.3, fuerza 2.2, sin urgencia) el pez se salia del encuadre —llegaba a 10.7 con
// el limite en 9— porque viraba tarde y con poca autoridad. Con estos se queda dentro en
// 4:3, 16:9 y ultrapanoramica tras 120 s simulados, y sigue usando casi todo el ancho.
const MARGEN = 2.2 // a que distancia del borde empieza a virar hacia dentro
const FUERZA = 3.5 // cuanto pesa el borde frente al rumbo actual
const URGENCIA = 2.5 // cuanto se permite girar de mas cuando ya esta encima del limite

export function FishScene(): React.JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
    })
    renderer.setClearAlpha(0)

    const escena = new THREE.Scene()
    const camara = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    camara.position.z = 10

    // Luz suave y muy ambiental: es la mitad del aspecto de juguete. Una key fuerte con
    // poca ambiental mete sombras duras y devuelve la pieza a "render realista".
    escena.add(new THREE.HemisphereLight(0xffffff, 0x6b4a2a, 2.6))
    const key = new THREE.DirectionalLight(0xfff6ea, 1.6)
    key.position.set(1.5, 3, 4)
    escena.add(key)
    const relleno = new THREE.DirectionalLight(0xffd9a8, 0.7)
    relleno.position.set(-2, -1.5, 2)
    escena.add(relleno)

    const { grupo, reloj } = crearGoldfish()

    /**
     * Dos grupos anidados, y no uno, porque rumbo y espejo NO se pueden mezclar en el mismo
     * nodo: si se orienta el pez girandolo sobre Z hasta apuntar a la izquierda, queda
     * nadando boca abajo. El pivote lleva el rumbo; el modelo, dentro, solo se voltea 180
     * grados sobre Y cuando va hacia la izquierda, y asi conserva el lomo arriba.
     */
    const pivote = new THREE.Group()
    pivote.add(grupo)
    // El cuerpo mide ~2 unidades de largo y el mundo 10 de alto: a escala 1 el pez ocupaba
    // media pantalla. A 0.42 queda del tamano de un pez que pasa, no de un cartel.
    grupo.scale.setScalar(0.5)
    escena.add(pivote)

    let anchoMundo = 0
    let x = 0
    let y = 0

    const redimensionar = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      // Se limita a 1.5: por encima de eso el coste de rasterizado se dispara y este pez
      // no gana nada visible en una pantalla 3x.
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      renderer.setSize(w, h, false)

      anchoMundo = (ALTO_MUNDO * w) / h
      camara.left = -anchoMundo / 2
      camara.right = anchoMundo / 2
      camara.top = ALTO_MUNDO / 2
      camara.bottom = -ALTO_MUNDO / 2
      camara.updateProjectionMatrix()

      // Al estrechar la ventana el pez puede quedar fuera del nuevo encuadre; se le devuelve
      // dentro en vez de dejarlo nadando en un limbo del que tardaria en volver.
      x = THREE.MathUtils.clamp(x, -anchoMundo / 2 + 1, anchoMundo / 2 - 1)
      y = THREE.MathUtils.clamp(y, -ALTO_MUNDO / 2 + 1, ALTO_MUNDO / 2 - 1)
    }
    redimensionar()
    window.addEventListener('resize', redimensionar, { passive: true })

    let ang = 0 // rumbo en radianes; 0 = hacia la derecha
    let t = 0
    let ultimo = 0
    let frame = 0

    /**
     * Ruido suave por suma de senos de periodos inconmensurables. No se repite a ojo y no
     * necesita tabla ni libreria; `Math.random` no sirve porque daria saltos, y lo que hace
     * falta aqui es una deriva CONTINUA del rumbo.
     */
    const deriva = (u: number) =>
      Math.sin(u * 0.53) * 0.6 + Math.sin(u * 1.19 + 1.7) * 0.3 + Math.sin(u * 2.31 + 4.1) * 0.1

    /** Cuanto se ha pasado de un limite, normalizado a 0–1. */
    const exceso = (v: number, limite: number) =>
      THREE.MathUtils.clamp((Math.abs(v) - limite) / MARGEN, 0, 1)

    const colocar = () => {
      pivote.position.set(x, y, 0)
      const izq = Math.cos(ang) < 0
      grupo.rotation.y = izq ? Math.PI : 0
      pivote.rotation.z = izq ? ang - Math.PI : ang
      renderer.render(escena, camara)
    }

    const reiniciar = () => {
      x = -anchoMundo / 2 + 1
      y = 0
      ang = 0
      colocar()
    }
    reiniciar()

    const bucle = (ahora: number) => {
      if (!ultimo) ultimo = ahora
      // Se acota el delta: al volver de una pestana en segundo plano el primer salto puede
      // ser de varios segundos y el pez apareceria teletransportado.
      const dt = Math.min((ahora - ultimo) / 1000, 0.05)
      ultimo = ahora
      t += dt
      reloj.value = t

      // 1. Deriva: el rumbo cambia solo, poco a poco.
      ang += deriva(t) * 0.9 * dt

      // 2. Viraje al acercarse a un borde. Se corrige HACIA EL CENTRO y con intensidad
      //    proporcional a lo cerca que esta: un rebote seco en el limite se ve como una
      //    pared invisible.
      const fx = exceso(x, anchoMundo / 2 - MARGEN) * -Math.sign(x)
      const fy = exceso(y, ALTO_MUNDO / 2 - MARGEN) * -Math.sign(y)
      const urgencia = Math.max(Math.abs(fx), Math.abs(fy))
      if (urgencia > 0) {
        const objetivo = Math.atan2(
          Math.sin(ang) + fy * FUERZA,
          Math.cos(ang) + fx * FUERZA,
        )
        let d = objetivo - ang
        d = Math.atan2(Math.sin(d), Math.cos(d)) // al rango [-pi, pi]
        // El limite de giro se afloja cuanto mas fuera esta: con un tope fijo, si llega al
        // borde con mucha velocidad no le da tiempo a virar y se escapa del encuadre.
        const tope = GIRO_MAX * (1 + urgencia * URGENCIA) * dt
        ang += THREE.MathUtils.clamp(d, -tope, tope)
      }

      // 3. Velocidad a rafagas: un pez no va a ritmo constante, acelera y se deja llevar.
      const rafaga = 0.7 + 0.45 * (0.5 + 0.5 * Math.sin(t * 0.62)) + 0.3 * Math.max(0, Math.sin(t * 1.7))
      const vel = VELOCIDAD * rafaga

      x += Math.cos(ang) * vel * dt
      y += Math.sin(ang) * vel * dt

      pivote.position.set(x, y, 0)

      const izq = Math.cos(ang) < 0
      grupo.rotation.y = izq ? Math.PI : 0
      pivote.rotation.z = izq ? ang - Math.PI : ang
      // Alabeo: se inclina hacia dentro del giro, como cualquier cosa que vira.
      grupo.rotation.x = THREE.MathUtils.clamp(deriva(t) * 0.35, -0.35, 0.35)

      renderer.render(escena, camara)
      frame = requestAnimationFrame(bucle)
    }

    frame = requestAnimationFrame(bucle)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', redimensionar)
      // Sin esto cada navegacion deja un contexto WebGL y su geometria en memoria; el
      // navegador solo permite unos pocos contextos vivos antes de tirar el mas antiguo.
      escena.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          const m = o.material
          if (Array.isArray(m)) m.forEach((x) => x.dispose())
          else m.dispose()
        }
      })
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
    />
  )
}
