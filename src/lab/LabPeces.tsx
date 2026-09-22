import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { crearGoldfish } from './goldfish'
import { bolas, torno, capsula, silueta } from './variantes'
import { metabolas, toon, casco, parametrica, capas } from './variantes2'
import { barrido } from './variante-barrido'
import { FishSvg } from '../components/FishSvg'

/**
 * Banco de pruebas para elegir el pez. NO esta enlazado desde ninguna parte del sitio: se
 * llega escribiendo /lab. Cuando se decida el diseno, esta carpeta se borra entera.
 *
 * Los cinco comparten escena y por tanto UN SOLO contexto WebGL. Con un canvas por pez el
 * navegador empieza a descartar los mas antiguos a partir de unos pocos contextos vivos y
 * algunos aparecerian en negro.
 */
type Variante = { id: string; nombre: string; nota: string; crear: () => THREE.Object3D }

const TANDA_1: Variante[] = [
  { id: 'perfil', nombre: '1 · Perfiles', nota: 'Esfera deformada por 3 tablas medidas.', crear: () => crearGoldfish().grupo },
  { id: 'bolas', nombre: '2 · Bolas', nota: 'Racimo de esferas solapadas.', crear: bolas },
  { id: 'torno', nombre: '3 · Torno', nota: 'Revolución de un perfil, aplastada.', crear: torno },
  { id: 'capsula', nombre: '4 · Cápsula', nota: 'Primitiva estirada. El control.', crear: capsula },
  { id: 'silueta', nombre: '5 · Silueta', nota: 'Un contorno plano extruido con bisel.', crear: silueta },
]

const TANDA_2: Variante[] = [
  { id: 'metabolas', nombre: '6 · Metabolas', nota: 'Superficie implícita: las masas se FUNDEN en una sola piel, sin piezas apoyadas.', crear: metabolas },
  { id: 'toon', nombre: '7 · Toon', nota: 'Lo cartoon lo da el sombreado: luz en escalones y contorno negro.', crear: toon },
  { id: 'casco', nombre: '8 · Casco', nota: 'Casco convexo de una nube de puntos. Superficie tensa, sin entrantes.', crear: casco },
  { id: 'parametrica', nombre: '9 · Paramétrica', nota: 'Superficie definida punto a punto. Tiene frente sobre el ojo y papada.', crear: parametrica },
  { id: 'capas', nombre: '10 · Capas', nota: 'Nueve siluetas apiladas. El volumen sale del escalonado, no de la luz.', crear: capas },
  { id: 'barrido', nombre: '12 · Barrido + rim', nota: 'Anillos barridos por una espina, cuerpo y aletas FUSIONADOS en una malla, y borde de luz por Fresnel.', crear: barrido },
  { id: 'glb', nombre: '11 · GLB descargado', nota: 'Modelo hecho a mano (Poly by Google, CC BY 3.0). Low-poly facetado, no plastilina.', crear: () => new THREE.Group() },
]

/**
 * El modelo descargado se carga aparte de las variantes procedurales porque llega ASINCRONO:
 * el resto se construye en el momento y este hay que esperarlo. Se le reserva su hueco y se
 * inserta cuando llega, en vez de bloquear el montaje de la escena.
 *
 * Goldfish · "Poly by Google" · poly.pizza · Creative Commons Attribution 3.0.
 * Si se elige esta pieza, la atribucion tiene que ir VISIBLE en el sitio: es obligacion de
 * la licencia, no cortesia.
 */
const MODELO_URL = `${import.meta.env.BASE_URL}pez-poly.glb`

const SEP = 3.0 // separacion entre peces, en unidades de mundo

export function LabPeces(): React.JSX.Element {
  const ref = useRef<HTMLCanvasElement>(null)
  const [girar, setGirar] = useState(true)
  const [tanda, setTanda] = useState<1 | 2>(2)
  const [tam, setTam] = useState(1)
  const girarRef = useRef(girar)
  const tamRef = useRef(tam)
  girarRef.current = girar
  tamRef.current = tam

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setClearAlpha(0)

    /**
     * Tone mapping + espacio de color. NO son opcionales para que un material PBR se vea
     * como un render: sin tone mapping, los valores por encima de 1 se recortan de golpe y
     * las zonas iluminadas salen planas y con el color lavado. ACES comprime esas altas
     * luces con curva, que es lo que da el acabado suave de la referencia.
     */
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.85
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const escena = new THREE.Scene()

    /**
     * MAPA DE ENTORNO (IBL). Es el cambio que mas se nota y el que faltaba: con solo luces
     * direccionales, `MeshStandardMaterial` recibe luz de dos o tres puntos y el resto del
     * hemisferio queda negro — de ahi el aspecto plano y de plastico barato.
     *
     * `RoomEnvironment` genera un estudio (paredes, techo, focos) por geometria y
     * `PMREMGenerator` lo convierte en el mapa filtrado que consume el PBR. Cero archivos
     * que descargar: no hay HDR que servir ni licencia que mirar.
     */
    const pmrem = new THREE.PMREMGenerator(renderer)
    const entorno = pmrem.fromScene(new RoomEnvironment(), 0.04)
    escena.environment = entorno.texture
    // El entorno se ATENUA. A intensidad plena se suma a las luces directas y quema el
    // amarillo: el pez sale lavado, que es peor que el aspecto plano que veniamos a
    // arreglar. El IBL debe aportar el relleno, no ser la fuente principal.
    escena.environmentIntensity = 0.45

    const camara = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100)
    camara.position.z = 10

    // Con el entorno haciendo el grueso, las luces directas bajan mucho: solo modelan.
    // Dejadas altas, se suman al IBL y queman el amarillo.
    const key = new THREE.DirectionalLight(0xfff6ea, 1.5)
    key.position.set(1.5, 3, 4)
    escena.add(key)
    const relleno = new THREE.DirectionalLight(0xffd9a8, 0.4)
    relleno.position.set(-2, -1.5, 2)
    escena.add(relleno)

    const lista = tanda === 1 ? TANDA_1 : TANDA_2
    const grupos = lista.map((v, i) => {
      const g = new THREE.Group()
      // Cada variante se construye AISLADA. Sin esto, un fallo en una sola —por ejemplo un
      // merge que devuelve null— lanza durante el render y deja la pagina entera en blanco,
      // que es justo lo contrario de lo que un banco de pruebas debe hacer.
      try {
        g.add(v.crear())
      } catch (e) {
        console.error(`variante "${v.id}" fallo:`, e)
      }
      g.position.x = (i - (lista.length - 1) / 2) * SEP
      escena.add(g)
      return g
    })

    // El GLB se inyecta en el hueco de su variante cuando termina de cargar.
    const iGlb = lista.findIndex((v) => v.id === 'glb')
    let cancelado = false
    if (iGlb >= 0) {
      new GLTFLoader().load(MODELO_URL, (gltf) => {
        if (cancelado) return
        const m = gltf.scene

        // El cuerpo del modelo corre a lo largo de Z (medido en el GLB: 95.6 de largo en Z
        // frente a 45.4 en Y y 26.6 en X) y el de la escena a lo largo de X. Sin girarlo se
        // ve de canto y parece una astilla. No se adivina el eje: se mide.
        m.rotation.y = Math.PI / 2

        // Se normaliza a la misma altura que las procedurales; si no, cada modelo entra con
        // la escala que traiga de su exportador y la comparacion no vale nada.
        const caja = new THREE.Box3().setFromObject(m)
        const tam = caja.getSize(new THREE.Vector3())
        m.scale.setScalar(1.6 / Math.max(tam.x, tam.y, tam.z))
        caja.setFromObject(m)
        m.position.sub(caja.getCenter(new THREE.Vector3()))
        grupos[iGlb].add(m)
      })
    }

    const redimensionar = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(w, h, false)

      // Se fija el ANCHO del mundo y se deriva el alto del aspecto, no al reves. Fijando el
      // alto, el ancho queda a merced de la ventana y en pantallas poco anchas solo cabian
      // tres de los cinco: los de los extremos se salian del encuadre.
      const ancho = lista.length * SEP
      const alto = (ancho * h) / w
      camara.left = -ancho / 2
      camara.right = ancho / 2
      camara.top = alto / 2
      camara.bottom = -alto / 2
      camara.updateProjectionMatrix()
    }
    redimensionar()
    window.addEventListener('resize', redimensionar, { passive: true })

    let t = 0
    let ultimo = 0
    let frame = 0
    const bucle = (ahora: number) => {
      if (!ultimo) ultimo = ahora
      const dt = Math.min((ahora - ultimo) / 1000, 0.05)
      ultimo = ahora
      if (girarRef.current) t += dt

      for (const g of grupos) {
        g.rotation.y = Math.sin(t * 0.55) * 0.85
        g.rotation.z = Math.sin(t * 0.4) * 0.1
        g.scale.setScalar(tamRef.current)
      }
      renderer.render(escena, camara)
      frame = requestAnimationFrame(bucle)
    }
    frame = requestAnimationFrame(bucle)

    return () => {
      cancelado = true
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', redimensionar)
      escena.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose()
          const m = o.material
          if (Array.isArray(m)) m.forEach((x) => x.dispose())
          else m.dispose()
        }
      })
      entorno.dispose()
      pmrem.dispose()
      renderer.dispose()
    }
  }, [tanda])

  return (
    <div className="min-h-screen">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h2 text-ink">Laboratorio · peces</h1>
          <p className="mt-1 text-body text-ink-muted">
            Diez construcciones, cinco por tanda. Cada una parte de una técnica distinta,
            no son variaciones de parámetros.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-mono text-micro text-ink-muted">
          <button
            type="button"
            onClick={() => setTanda((t) => (t === 1 ? 2 : 1))}
            className="border border-ink px-3 py-2 text-ink"
          >
            tanda {tanda} · ver la otra
          </button>
          <button
            type="button"
            onClick={() => setGirar((g) => !g)}
            className="border border-rule px-3 py-2 text-ink"
          >
            {girar ? 'congelar' : 'girar'}
          </button>
          {/* El tamano real en la pagina es ~0.5. Ver los candidatos a ESE tamano es la
              prueba que importa: varios se caen al achicarlos y ninguno se nota grande. */}
          {[0.4, 0.7, 1, 1.4].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setTam(v)}
              className={`border px-3 py-2 ${tam === v ? 'border-ink text-ink' : 'border-rule'}`}
            >
              ×{v}
            </button>
          ))}
        </div>
      </header>

      <canvas ref={ref} className="block h-[46vh] min-h-[280px] w-full rounded-sharp border border-rule" />

      {/* El candidato en SVG va FUERA del canvas: es 2D y no tiene nada que hacer en una
          escena de Three. Se muestra a los tamanos reales de uso para juzgarlo donde
          importa, no ampliado. */}
      <section className="mt-6 border border-rule bg-rule">
        <div className="grid gap-px bg-rule sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="bg-bg px-4 py-3">
            <p className="spec-tag text-ink">13 · SVG 2D</p>
            <p className="mt-1 text-micro text-ink-muted">
              Dibujado a mano con trazados. Sin Three.js, sin luz que calibrar. ~2 KB.
            </p>
          </div>
          <div className="flex items-end gap-x-8 bg-bg px-4 py-3">
            {[56, 96, 160, 240].map((w) => (
              <div key={w} className="flex flex-col items-center gap-y-2">
                <FishSvg className="block" style={{ width: w }} />
                <span className="spec-tag text-ink-muted">{w}px</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ul className="mt-4 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-5">
        {(tanda === 1 ? TANDA_1 : TANDA_2).map((v) => (
          <li key={v.id} className="bg-bg px-4 py-3">
            <p className="spec-tag text-ink">{v.nombre}</p>
            <p className="mt-1 text-micro text-ink-muted">{v.nota}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
