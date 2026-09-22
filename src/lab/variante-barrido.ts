import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { PALETA, mate, ojo } from './variantes'

/**
 * Variante 12 · BARRIDO + FUSION + RIM.
 *
 * Aplica tres tecnicas que no estaban en ninguna de las once anteriores y que atacan lo que
 * fallaba en todas ellas:
 *
 *  1. BARRIDO DE SECCIONES. El cuerpo no es una primitiva deformada: se construye a mano
 *     como BufferGeometry indexada, barriendo anillos elipticos a lo largo de una ESPINA.
 *     Cada anillo tiene su alto de lomo, su alto de vientre y su ancho. Es como se modela
 *     un cuerpo organico de verdad, y permite que la linea central BAJE hacia la cabeza —
 *     ninguna esfera escalada puede hacer eso.
 *
 *  2. FUSION. Cuerpo y aletas se combinan con `mergeGeometries` en UNA sola malla. Hasta
 *     ahora eran objetos distintos y por eso se leian como piezas pegadas: al fusionarlos
 *     comparten material, normales y sombreado, y el pez pasa a ser una pieza.
 *
 *  3. RIM POR FRESNEL. Un borde de luz en la silueta, calculado con el angulo entre la
 *     normal y la camara. Es lo que separa la figura del fondo oscuro; sin el, un objeto
 *     pequeno sobre negro se lee como una mancha plana por muy bien iluminado que este.
 */

// ─── Perfiles TRAZADOS sobre la vista de perfil de la hoja de referencia ────
// No estan estimados: se segmento la hoja por color (amarillo = cuerpo, naranja = aleta),
// se aislo el panel "Side Profile" por componentes conectadas y se midio columna a columna.
//
//   cuerpo largo/alto ....... 1.97   (antes estimaba 1.69, y antes de eso 1.09)
//   ancho/alto (vista Front)  0.93   (¡casi circular! yo lo tenia en 0.55: demasiado plano)
//   dorsal sobre el lomo .... 0.47 del alto del cuerpo
//   ventral bajo el vientre . 0.35
//   caudal tras el cuerpo ... 0.27 del largo
//   ojo, centro ............. 0.16 del largo desde el morro
const LARGO = 2.0
const RATIO = 1.97
const ALTO = LARGO / RATIO
const ANCHO_REL = 0.93 // respecto al alto, de la vista frontal

const LOMO: [number, number][] = [
  [1.0, 0.05], [0.96, 0.23], [0.9, 0.39], [0.8, 0.55], [0.65, 0.73],
  [0.45, 0.84], [0.25, 0.88], [0.05, 0.91], [-0.2, 0.86], [-0.45, 0.73],
  [-0.7, 0.55], [-0.9, 0.37], [-1.0, 0.12],
]

// Entre x = -0.2 y -0.45 la pectoral tapa el vientre en la referencia y la traza da valores
// imposibles (0.62 despues de 1.09). Ese tramo se interpola: es un hueco de medicion, no un
// entrante real del cuerpo.
const VIENTRE: [number, number][] = [
  [1.0, 0.02], [0.96, 0.25], [0.9, 0.43], [0.8, 0.63], [0.65, 0.83],
  [0.45, 1.01], [0.25, 1.09], [0.05, 1.09], [-0.2, 1.0], [-0.45, 0.85],
  [-0.7, 0.58], [-0.9, 0.25], [-1.0, 0.04],
]

const MAX_ANCHO = (ANCHO_REL * ALTO) / 2
const ANCHO: [number, number][] = [
  [1.0, 0.04], [0.96, 0.3], [0.9, 0.47], [0.8, 0.66], [0.65, 0.85],
  [0.45, 0.96], [0.25, 1.0], [0.05, 0.98], [-0.2, 0.87], [-0.45, 0.7],
  [-0.7, 0.47], [-0.9, 0.21], [-1.0, 0.04],
].map(([x, v]) => [x, v * MAX_ANCHO]) as [number, number][]

const K = ALTO / (0.91 + 1.09)

function tabla(t: [number, number][], x: number): number {
  if (x >= t[0][0]) return t[0][1]
  for (let i = 1; i < t.length; i++) {
    if (x >= t[i][0]) {
      const [x0, v0] = t[i - 1]
      const [x1, v1] = t[i]
      return v0 + (v1 - v0) * ((x - x0) / (x1 - x0))
    }
  }
  return t[t.length - 1][1]
}

/**
 * La ESPINA: la linea central del cuerpo. No es recta — cae hacia la cabeza, que es lo que
 * hace que el morro apunte ligeramente hacia abajo y la nuca quede alta. Es un detalle
 * pequeno y es la diferencia entre un pez y un balon alargado.
 */
function espina(x: number): number {
  return -ALTO * 0.1 * Math.exp(-(((x - 0.55) / 0.5) ** 2))
}

const ANILLOS = 96
const LADOS = 56

function cuerpoBarrido(): THREE.BufferGeometry {
  const pos: number[] = []
  const col: number[] = []
  const idx: number[] = []

  const cLomo = new THREE.Color(PALETA.lomo)
  const cCuerpo = new THREE.Color(PALETA.cuerpo)
  const cVientre = new THREE.Color(PALETA.vientre)
  const cCola = new THREE.Color(PALETA.cola)

  for (let i = 0; i <= ANILLOS; i++) {
    const x = 1 - (i / ANILLOS) * 2
    const cy = espina(x)
    const up = tabla(LOMO, x) * K
    const dn = tabla(VIENTRE, x) * K
    const rz = tabla(ANCHO, x)
    const haciaCola = THREE.MathUtils.clamp((0.15 - x) / 1.1, 0, 1)

    for (let j = 0; j <= LADOS; j++) {
      const a = (j / LADOS) * Math.PI * 2
      const sy = Math.sin(a)
      const sz = Math.cos(a)
      const y = cy + sy * (sy >= 0 ? up : dn)
      pos.push(x, y, sz * rz)

      const c = (sy >= 0 ? cLomo : cCuerpo)
        .clone()
        .lerp(cVientre, THREE.MathUtils.clamp(-sy * 1.1, 0, 1) * 0.72)
        .lerp(cCola, Math.pow(haciaCola, 1.4) * 0.8)
      col.push(c.r, c.g, c.b)
    }
  }

  // Malla INDEXADA: se reutilizan los vertices del anillo en vez de duplicarlos por
  // triangulo. Se desindexa justo antes de fusionar, porque `mergeGeometries` no admite
  // mezclar indexadas con no indexadas.
  for (let i = 0; i < ANILLOS; i++) {
    for (let j = 0; j < LADOS; j++) {
      const a = i * (LADOS + 1) + j
      const b = a + LADOS + 1
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.setIndex(idx)
  g.computeVertexNormals() // obligatorio tras construir posiciones a mano
  return g
}

function hoja(shape: THREE.Shape): THREE.BufferGeometry {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.035, bevelEnabled: true, bevelSize: 0.06,
    bevelThickness: 0.05, bevelSegments: 6, curveSegments: 26,
  })
  const p = g.attributes.position
  const col: number[] = []
  const base = new THREE.Color(PALETA.aletaBase)
  const punta = new THREE.Color(PALETA.aleta)
  let rmax = 0
  for (let i = 0; i < p.count; i++) rmax = Math.max(rmax, Math.hypot(p.getX(i), p.getY(i)))
  for (let i = 0; i < p.count; i++) {
    const t = THREE.MathUtils.clamp(Math.hypot(p.getX(i), p.getY(i)) / (rmax || 1), 0, 1)
    const c = base.clone().lerp(punta, Math.pow(t, 0.6))
    col.push(c.r, c.g, c.b)
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  // Se descartan los atributos que el cuerpo no tiene: `mergeGeometries` exige que TODAS
  // las geometrias declaren exactamente el mismo juego, o devuelve null sin explicar nada.
  g.deleteAttribute('uv')
  g.computeVertexNormals()
  return g
}

function pala(largo: number, ancho: number): THREE.Shape {
  const s = new THREE.Shape()
  s.moveTo(0, ancho * 0.44)
  s.bezierCurveTo(largo * 0.44, ancho * 1.02, largo * 0.9, ancho * 0.48, largo, 0)
  s.bezierCurveTo(largo * 0.88, -ancho * 0.42, largo * 0.4, -ancho * 0.74, 0, -ancho * 0.44)
  return s
}

function vela(): THREE.Shape {
  // Sube 0.47 del alto del cuerpo sobre el lomo, mas lo que se hunde dentro.
  const h = ALTO * (0.47 + 0.14)
  const s = new THREE.Shape()
  s.moveTo(0.56, 0)
  s.bezierCurveTo(0.52, h * 0.58, 0.32, h * 0.98, 0.02, h)
  s.bezierCurveTo(-0.28, h * 1.02, -0.46, h * 0.62, -0.66, 0.02)
  s.bezierCurveTo(-0.34, -0.08, 0.26, -0.09, 0.56, 0)
  return s
}

function caudal(): THREE.Shape {
  const h = ALTO * 0.62
  const s = new THREE.Shape()
  s.moveTo(0, ALTO * 0.1)
  s.bezierCurveTo(-0.2, h * 0.7, -0.42, h * 0.98, -0.62, h)
  s.bezierCurveTo(-0.5, h * 0.5, -0.4, h * 0.16, -0.28, 0)
  s.bezierCurveTo(-0.4, -h * 0.16, -0.5, -h * 0.5, -0.62, -h)
  s.bezierCurveTo(-0.42, -h * 0.98, -0.2, -h * 0.7, 0, -ALTO * 0.1)
  s.lineTo(0, ALTO * 0.1)
  return s
}

/** Coloca una geometria de aleta en el sitio antes de fusionarla. */
function situar(g: THREE.BufferGeometry, p: [number, number, number], r: [number, number, number]) {
  const m = new THREE.Object3D()
  m.position.set(...p)
  m.rotation.set(...r)
  m.updateMatrix()
  g.applyMatrix4(m.matrix)
  return g
}

/**
 * Rim por Fresnel, inyectado en `MeshStandardMaterial` con `onBeforeCompile` en vez de
 * escribir un ShaderMaterial entero: asi se conserva el PBR, el mapa de entorno y las
 * sombras, y solo se anade el borde. Con ShaderMaterial habria que reimplementarlo todo.
 */
function conRim(mat: THREE.MeshStandardMaterial, fuerza = 0.55) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uRim = { value: fuerza }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vRimN;\nvarying vec3 vRimP;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         vRimN = normalize(normalMatrix * objectNormal);
         vRimP = (modelViewMatrix * vec4(transformed, 1.0)).xyz;`,
      )
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uRim;\nvarying vec3 vRimN;\nvarying vec3 vRimP;')
      .replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
         // 1 en el borde de la silueta, 0 de frente. El exponente concentra el brillo en
         // el canto; sin el, el rim se derrama por toda la superficie y lava el color.
         float rim = pow(1.0 - abs(dot(normalize(vRimN), normalize(-vRimP))), 3.0);
         gl_FragColor.rgb += vec3(1.0, 0.86, 0.62) * rim * uRim;`,
      )
  }
}

export function barrido(): THREE.Group {
  const g = new THREE.Group()

  // `mergeGeometries` exige que TODAS las geometrias sean indexadas o NINGUNA; si se
  // mezclan, devuelve null. El cuerpo se construye indexado (reutiliza los vertices de cada
  // anillo) y las extruidas de las aletas no lo son, asi que aqui se desindexa el cuerpo.
  // Comprobado fuera del navegador: mezclarlas devuelve null y el throw tumbaba la app.
  const partes: THREE.BufferGeometry[] = [cuerpoBarrido().toNonIndexed()]

  partes.push(situar(hoja(vela()), [0.05, tabla(LOMO, 0.05) * K - ALTO * 0.12, 0], [0, 0, 0]))
  partes.push(situar(hoja(caudal()), [-0.96, 0, 0], [0, 0, 0]))
  for (const l of [1, -1]) {
    partes.push(
      situar(hoja(pala(ALTO * 0.5, ALTO * 0.22)), [0.22, -ALTO * 0.3, tabla(ANCHO, 0.22) * 0.86 * l], [0, (Math.PI / 2.4) * l, Math.PI * 0.8]),
    )
  }
  partes.push(
    situar(hoja(pala(ALTO * 0.42, ALTO * 0.17)), [-0.42, -tabla(VIENTRE, -0.42) * K + ALTO * 0.06, 0], [0, 0, Math.PI * 0.8]),
  )

  const fusionada = mergeGeometries(partes, false)
  if (!fusionada) throw new Error('mergeGeometries devolvio null: los atributos no coinciden')
  fusionada.computeVertexNormals()

  const material = mate({ vertexColors: true, side: THREE.DoubleSide }) as THREE.MeshStandardMaterial
  conRim(material)
  g.add(new THREE.Mesh(fusionada, material))

  for (const l of [1, -1]) {
    // Centro medido a 0.16 del largo desde el morro -> x = 1 - 2(0.16) = 0.68
    const o = ojo(l, ALTO * 0.16)
    o.position.set(0.68, ALTO * 0.2 + espina(0.68), tabla(ANCHO, 0.68) * 0.66 * l)
    g.add(o)
  }
  return g
}
