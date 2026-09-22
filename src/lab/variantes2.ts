import * as THREE from 'three'
import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js'
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js'
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js'
import { PALETA, mate, ojo } from './variantes'

/**
 * Segunda tanda. Las cinco primeras compartian el mismo defecto: TODAS eran una primitiva
 * deformada con aletas pegadas encima. Cambiar parametros sobre esa base no iba a arreglar
 * lo que fallaba —el pez se leia como un bulto con un ojo de pegatina—, asi que estas cinco
 * cambian de TECNICA.
 */

function aletaPlana(shape: THREE.Shape, color = PALETA.aleta): THREE.Mesh {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.04, bevelEnabled: true, bevelSize: 0.07,
    bevelThickness: 0.055, bevelSegments: 7, curveSegments: 28,
  })
  g.center()
  return new THREE.Mesh(g, mate({ color, side: THREE.DoubleSide }))
}

function pala(largo: number, ancho: number): THREE.Shape {
  const s = new THREE.Shape()
  s.moveTo(0, ancho * 0.42)
  s.bezierCurveTo(largo * 0.42, ancho, largo * 0.9, ancho * 0.5, largo, 0)
  s.bezierCurveTo(largo * 0.88, -ancho * 0.42, largo * 0.4, -ancho * 0.72, 0, -ancho * 0.42)
  return s
}

function aletasComunes(g: THREE.Group, alto: number) {
  const d = aletaPlana(pala(alto * 0.8, alto * 0.42))
  d.position.set(0.02, alto * 0.62, 0)
  d.rotation.z = Math.PI * 0.6
  g.add(d)

  const c = aletaPlana(pala(alto * 0.66, alto * 0.5))
  c.position.set(-1.02, 0, 0)
  c.rotation.z = Math.PI
  g.add(c)

  for (const l of [1, -1]) {
    const p = aletaPlana(pala(alto * 0.46, alto * 0.22))
    p.position.set(0.2, -alto * 0.34, 0.28 * l)
    p.rotation.set(0, (Math.PI / 2.4) * l, Math.PI * 0.8)
    g.add(p)
  }
}

// ─── 6 · METABOLAS ──────────────────────────────────────────────────────────
/**
 * Superficie IMPLICITA por marching cubes. Se colocan "bolas" de campo y el algoritmo saca
 * una malla continua donde se solapan: cabeza, tronco y pedunculo quedan FUNDIDOS en una
 * sola piel, sin costuras ni piezas apoyadas.
 *
 * Es la tecnica con la que se modela un personaje de plastilina, y ataca justo lo que
 * fallaba en la primera tanda: que el pez se leyera como un montaje de partes.
 */
export function metabolas(): THREE.Group {
  const g = new THREE.Group()
  const mc = new MarchingCubes(56, mate({ color: PALETA.cuerpo }), true, false, 90000)
  mc.isolation = 42

  // El espacio de marching cubes es 0..1; 0.5 es el centro.
  const bola = (x: number, y: number, z: number, r: number) =>
    mc.addBall(0.5 + x * 0.24, 0.5 + y * 0.24, 0.5 + z * 0.24, r, 12)

  bola(0.5, 0.05, 0, 0.42) // cabeza
  bola(0.1, -0.02, 0, 0.4) // tronco
  bola(-0.35, 0.0, 0, 0.3) // hacia la cola
  bola(-0.7, 0.0, 0, 0.18) // pedunculo
  bola(0.45, -0.3, 0, 0.3) // papada
  mc.update()

  mc.scale.set(2.1, 2.1, 2.1 * 0.6) // comprimido lateralmente, como todo pez
  g.add(mc)

  aletasComunes(g, 1.0)
  for (const l of [1, -1]) {
    const o = ojo(l, 0.3)
    o.position.set(0.68, 0.24, 0.3 * l)
    g.add(o)
  }
  return g
}

// ─── 7 · TOON + CONTORNO ────────────────────────────────────────────────────
/**
 * Aqui lo cartoon no lo da la geometria sino el SOMBREADO: luz en escalones (toon) y un
 * contorno negro hecho con casco invertido —una copia del cuerpo, un pelin mas grande, con
 * las caras traseras—. Es como se dibuja un personaje de dibujos animados en 3D.
 */
export function toon(): THREE.Group {
  const g = new THREE.Group()

  // Rampa de 3 escalones: el degradado continuo es lo que hace que algo parezca "render".
  const rampa = new THREE.DataTexture(
    new Uint8Array([90, 70, 20, 255, 220, 175, 40, 255, 255, 225, 120, 255]),
    3, 1, THREE.RGBAFormat,
  )
  rampa.needsUpdate = true
  rampa.magFilter = THREE.NearestFilter
  rampa.minFilter = THREE.NearestFilter

  const geo = new THREE.SphereGeometry(1, 64, 48)
  geo.rotateZ(Math.PI / 2)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const k = x > 0.5 ? Math.sqrt(Math.max(0, 1 - ((x - 0.5) / 0.5) ** 2)) : 1 - 0.9 * ((0.5 - x) / 1.5) ** 1.5
    pos.setY(i, pos.getY(i) * k * 0.62)
    pos.setZ(i, pos.getZ(i) * k * 0.34)
  }
  geo.computeVertexNormals()

  g.add(new THREE.Mesh(geo, new THREE.MeshToonMaterial({ color: PALETA.cuerpo, gradientMap: rampa })))

  const contorno = new THREE.Mesh(
    geo.clone(),
    new THREE.MeshBasicMaterial({ color: '#3a1f06', side: THREE.BackSide }),
  )
  contorno.scale.setScalar(1.045)
  g.add(contorno)

  aletasComunes(g, 0.62)
  for (const l of [1, -1]) {
    const o = ojo(l, 0.26)
    o.position.set(0.66, 0.16, 0.2 * l)
    g.add(o)
  }
  return g
}

// ─── 8 · CASCO CONVEXO ──────────────────────────────────────────────────────
/**
 * Se siembra una nube de puntos con la forma deseada y se toma su CASCO CONVEXO. El
 * resultado es una superficie tensa, sin entrantes, que es exactamente lo que caracteriza
 * a un juguete de plastico moldeado: no tiene concavidades porque no puede tenerlas.
 */
export function casco(): THREE.Group {
  const g = new THREE.Group()
  const pts: THREE.Vector3[] = []
  const perfil = (x: number) =>
    x > 0.45 ? Math.sqrt(Math.max(0, 1 - ((x - 0.45) / 0.55) ** 2)) : 1 - 0.92 * ((0.45 - x) / 1.45) ** 1.6

  for (let i = 0; i <= 26; i++) {
    const x = -1 + (i / 26) * 2
    const r = perfil(x)
    for (let j = 0; j < 22; j++) {
      const a = (j / 22) * Math.PI * 2
      const arriba = Math.sin(a) > 0
      pts.push(new THREE.Vector3(
        x,
        Math.sin(a) * r * (arriba ? 0.56 : 0.68), // el vientre baja mas que el lomo
        Math.cos(a) * r * 0.34,
      ))
    }
  }
  const geo = new ConvexGeometry(pts)
  geo.computeVertexNormals()
  g.add(new THREE.Mesh(geo, mate({ color: PALETA.cuerpo })))

  aletasComunes(g, 0.64)
  for (const l of [1, -1]) {
    const o = ojo(l, 0.27)
    o.position.set(0.64, 0.2, 0.22 * l)
    g.add(o)
  }
  return g
}

// ─── 9 · PARAMETRICA ────────────────────────────────────────────────────────
/**
 * La superficie se define con una FUNCION explicita de (u, v): para cada punto se decide su
 * posicion a mano. Es el control total — permite meter cosas que ninguna primitiva da, como
 * el arco de la frente sobre el ojo o el estrechamiento del pedunculo, sin deformar despues.
 */
export function parametrica(): THREE.Group {
  const g = new THREE.Group()

  const superficie = (u: number, v: number, dest: THREE.Vector3) => {
    const x = 1 - u * 2 // +1 morro -> -1 cola
    const a = v * Math.PI * 2

    // Perfil base
    const base =
      x > 0.42 ? Math.sqrt(Math.max(0, 1 - ((x - 0.42) / 0.58) ** 2)) : 1 - 0.93 * ((0.42 - x) / 1.42) ** 1.7
    const arriba = Math.sin(a)

    // Frente: un abombamiento extra sobre el ojo. Es el rasgo que ninguna esfera da y el
    // que hace que la cabeza se lea como cabeza.
    const frente = Math.exp(-(((x - 0.58) / 0.22) ** 2)) * Math.max(0, arriba) * 0.16
    // Papada bajo el morro.
    const papada = Math.exp(-(((x - 0.5) / 0.3) ** 2)) * Math.max(0, -arriba) * 0.2

    const ry = base * (arriba > 0 ? 0.55 + frente : 0.66 + papada)
    const rz = base * 0.34

    dest.set(x, Math.sin(a) * ry, Math.cos(a) * rz)
  }

  const geo = new ParametricGeometry(superficie, 90, 60)
  geo.computeVertexNormals()
  g.add(new THREE.Mesh(geo, mate({ color: PALETA.cuerpo })))

  aletasComunes(g, 0.66)
  for (const l of [1, -1]) {
    const o = ojo(l, 0.27)
    o.position.set(0.6, 0.24, 0.22 * l)
    g.add(o)
  }
  return g
}

// ─── 10 · CAPAS ─────────────────────────────────────────────────────────────
/**
 * Nueve siluetas planas apiladas en Z, cada una un poco menor. El volumen sale del
 * ESCALONADO, no del sombreado: es papercraft. Es la unica que no depende de la luz, asi
 * que se ve igual sobre cualquier fondo y a cualquier tamano.
 */
export function capas(): THREE.Group {
  const g = new THREE.Group()

  const s = new THREE.Shape()
  s.moveTo(1.0, -0.02)
  s.bezierCurveTo(0.9, 0.42, 0.62, 0.6, 0.34, 0.62)
  s.bezierCurveTo(0.0, 0.64, -0.4, 0.5, -0.72, 0.24)
  s.bezierCurveTo(-0.8, 0.2, -0.86, 0.14, -0.92, 0.06)
  s.bezierCurveTo(-0.86, -0.14, -0.8, -0.2, -0.72, -0.24)
  s.bezierCurveTo(-0.4, -0.52, 0.0, -0.68, 0.34, -0.64)
  s.bezierCurveTo(0.62, -0.62, 0.9, -0.44, 1.0, -0.02)

  const N = 9
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1) // 0 borde trasero -> 1 centro
    const centro = 1 - Math.abs(t * 2 - 1)
    const geo = new THREE.ShapeGeometry(s, 40)
    const m = new THREE.Mesh(
      geo,
      mate({
        color: new THREE.Color(PALETA.vientre).lerp(new THREE.Color(PALETA.lomo), centro),
        side: THREE.DoubleSide,
      }),
    )
    m.scale.setScalar(0.72 + centro * 0.28)
    m.position.z = (t - 0.5) * 0.5
    g.add(m)
  }

  aletasComunes(g, 0.62)
  for (const l of [1, -1]) {
    const o = ojo(l, 0.24)
    o.position.set(0.6, 0.18, 0.2 * l)
    g.add(o)
  }
  return g
}
