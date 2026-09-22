import * as THREE from 'three'

/**
 * Pez dorado cartoon.
 *
 * Las proporciones NO estan estimadas: se trazaron sobre la referencia segmentando la
 * imagen por color (amarillo = cuerpo, naranja = aleta) y midiendo. Lo que salio de ahi:
 *
 *   cuerpo largo/alto ......... 1.69   (el modelo anterior estaba en 1.09: un 55% mas alto
 *                                       de lo debido, y de ahi el aspecto de limon)
 *   area aletas / cuerpo ...... 1.04   (las aletas pesan TANTO como el cuerpo; las
 *                                       anteriores rondaban un tercio)
 *   dorsal sobre el lomo ...... 0.39 del alto del cuerpo
 *   ventral bajo el vientre ... 0.31
 *   pupila .................... 0.23 del alto del cuerpo
 *
 * Colores muestreados de la misma imagen: lomo #F4D666 · cuerpo #EEC944 · mejilla #F0BF03
 * vientre #CC7901 · dorsal #E9773B · caudal #E8714F · pectoral #F36F3E. Llevan la luz del
 * render original dentro, asi que el albedo va algo mas claro y la escena la vuelve a
 * oscurecer por su cuenta.
 */

// ─── Proporciones medidas ───────────────────────────────────────────────────
const LARGO = 2.0 // el cuerpo va de x = -1 a x = +1
const RATIO = 1.69 // largo / alto, medido
const ALTO = LARGO / RATIO // 1.183

/**
 * Perfiles del cuerpo: [x, radio] con x de +1 (morro) a -1 (cola), radio en fraccion del
 * semialto. Tres tablas INDEPENDIENTES —lomo, vientre y ancho— y no un factor unico: con
 * un solo factor el cuerpo sale simetrico arriba/abajo y no hay forma de conseguir la
 * panza, que es lo que distingue un pez de un huevo.
 *
 * Se definen como TABLA y no como formula porque una curva sacada de una imagen se ajusta
 * moviendo puntos; con una formula cada retoque obliga a re-derivarla entera.
 */
const LOMO: [number, number][] = [
  [1.0, 0.02], [0.94, 0.17], [0.85, 0.33], [0.7, 0.51], [0.5, 0.73],
  [0.28, 0.88], [0.05, 0.9], [-0.2, 0.84], [-0.45, 0.68], [-0.65, 0.5],
  [-0.82, 0.3], [-1.0, 0.06],
]

// El vientre baja mas que el lomo desde el mismo morro: es la "papada" del original.
const VIENTRE: [number, number][] = [
  [1.0, 0.02], [0.94, 0.41], [0.85, 0.55], [0.7, 0.76], [0.5, 0.85],
  [0.28, 0.92], [0.05, 1.0], [-0.2, 0.86], [-0.45, 0.64], [-0.65, 0.46],
  [-0.82, 0.28], [-1.0, 0.06],
]

// Semiancho en unidades finales. Un pez dorado es comprimido: ancho ≈ la mitad del alto.
const ANCHO: [number, number][] = [
  [1.0, 0.01], [0.94, 0.1], [0.85, 0.17], [0.7, 0.24], [0.5, 0.28],
  [0.28, 0.3], [0.05, 0.29], [-0.2, 0.26], [-0.45, 0.2], [-0.65, 0.14],
  [-0.82, 0.08], [-1.0, 0.02],
]

const MAX_LOMO = 0.9
const MAX_VIENTRE = 1.0
/** Lleva las tablas normalizadas al alto real medido. */
const K = ALTO / (MAX_LOMO + MAX_VIENTRE)

function muestrear(tabla: [number, number][], x: number): number {
  if (x >= tabla[0][0]) return tabla[0][1]
  for (let i = 1; i < tabla.length; i++) {
    if (x >= tabla[i][0]) {
      const [x0, v0] = tabla[i - 1]
      const [x1, v1] = tabla[i]
      return v0 + (v1 - v0) * ((x - x0) / (x1 - x0))
    }
  }
  return tabla[tabla.length - 1][1]
}

// ─── Color ──────────────────────────────────────────────────────────────────
const C_LOMO = new THREE.Color('#ffdc6a')
const C_CUERPO = new THREE.Color('#fbcf35')
const C_VIENTRE = new THREE.Color('#e08a06')
const C_COLA = new THREE.Color('#f9a52c')
const C_ALETA = new THREE.Color('#f8763a')
const C_ALETA_BASE = new THREE.Color('#fb9a45')
const C_TRAZO = new THREE.Color('#c9740a')

const OJO_X = 0.6
const OJO_Y = ALTO * 0.3
const OJO_R = ALTO * 0.19 // esclerotica; la pupila sale 0.23 del alto, como en la medicion

/**
 * Boca y sombra de contacto del ojo. Se PINTAN sobre el cuerpo, no se modelan.
 *
 * Un toro en z = 0 queda dentro del cuerpo, que es opaco, y sacarlo a la superficie lo
 * despega en cuanto cambia la curvatura. Pintado por vertice sigue la superficie exacta.
 *
 * Las dos devuelven INTENSIDAD con caida suave, no un si/no: con umbral duro la marca salta
 * de vertice a vertice y sale escalonada — a esta densidad de malla, una banda estrecha
 * apenas toca unos pocos vertices.
 */
function boca(x: number, y: number, uz: number): number {
  if (x < 0.74) return 0
  // Se acota TAMBIEN en `uz`: con solo la banda en `y`, la franja daba la vuelta a todo el
  // contorno y salia una costura cruzando el carrillo de lado a lado.
  const frente = 1 - THREE.MathUtils.smoothstep(Math.abs(uz), 0.35, 0.7)
  if (frente <= 0) return 0
  const linea = -ALTO * 0.13 - (x - 0.86) * 0.4
  return (1 - THREE.MathUtils.smoothstep(Math.abs(y - linea), 0.008, 0.035)) * frente
}

/** Sombra bajo el ojo: lo apoya en la cabeza en vez de dejarlo flotando pegado. */
function sombraOjo(x: number, y: number, z: number): number {
  const d = Math.hypot(x - OJO_X, (y - OJO_Y) * 1.1, (Math.abs(z) - 0.24) * 1.4)
  return (1 - THREE.MathUtils.smoothstep(d, OJO_R * 0.9, OJO_R * 1.7)) * 0.35
}

function mate(opts: THREE.MeshStandardMaterialParameters = {}) {
  // Mate y sin metalness: el acabado de plastilina del original. Un `roughness` bajo mete
  // un reflejo duro que lo devuelve a "render de producto".
  return new THREE.MeshStandardMaterial({ roughness: 0.84, metalness: 0, ...opts })
}

function cuerpo(): THREE.Mesh {
  const g = new THREE.SphereGeometry(1, 120, 84)
  g.rotateZ(Math.PI / 2) // polos al eje X: morro y cola

  const pos = g.attributes.position
  const colores: number[] = []

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    // El corte de la esfera en `x` es un circulo de radio sqrt(1-x²); se normaliza para
    // tener la direccion pura y aplicar despues el radio de cada perfil.
    const rad = Math.sqrt(Math.max(1e-6, 1 - x * x))
    const uy = pos.getY(i) / rad
    const uz = pos.getZ(i) / rad

    const y = uy * muestrear(uy >= 0 ? LOMO : VIENTRE, x) * K
    const z = uz * muestrear(ANCHO, x)
    pos.setY(i, y)
    pos.setZ(i, z)

    const haciaCola = THREE.MathUtils.clamp((0.15 - x) / 1.1, 0, 1)
    const c = (uy >= 0 ? C_LOMO : C_CUERPO)
      .clone()
      .lerp(C_VIENTRE, THREE.MathUtils.clamp(-uy * 1.1, 0, 1) * 0.72)
      .lerp(C_COLA, Math.pow(haciaCola, 1.4) * 0.8)
      .lerp(C_TRAZO, Math.max(boca(x, y, uz) * 0.8, sombraOjo(x, y, z)))
    colores.push(c.r, c.g, c.b)
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(colores, 3))
  g.computeVertexNormals()

  return new THREE.Mesh(g, mate({ vertexColors: true }))
}

/**
 * Aleta con VOLUMEN: se extruye poco pero se BISELA mucho. El bisel redondea todo el
 * perimetro y aporta la mayor parte del grosor, dejando la seccion abombada en vez de
 * recta — sin el, la aleta es una lamina y se lee como cartulina recortada.
 */
function aleta(shape: THREE.Shape, escala = 1): THREE.Mesh {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: 0.035,
    bevelEnabled: true,
    bevelSize: 0.06 * escala,
    bevelThickness: 0.05 * escala,
    bevelSegments: 7,
    curveSegments: 32,
  })
  g.translate(0, 0, -0.017)

  const pos = g.attributes.position
  const colores: number[] = []
  let rmax = 0
  for (let i = 0; i < pos.count; i++) rmax = Math.max(rmax, Math.hypot(pos.getX(i), pos.getY(i)))
  for (let i = 0; i < pos.count; i++) {
    // Base clara para fundir con el cuerpo, punta naranja fuerte. Es lo que hace que la
    // aleta parezca NACER del pez y no estar pegada encima.
    const t = THREE.MathUtils.clamp(Math.hypot(pos.getX(i), pos.getY(i)) / (rmax || 1), 0, 1)
    const c = C_ALETA_BASE.clone().lerp(C_ALETA, Math.pow(t, 0.6))
    colores.push(c.r, c.g, c.b)
  }
  g.setAttribute('color', new THREE.Float32BufferAttribute(colores, 3))
  g.computeVertexNormals()

  return new THREE.Mesh(g, mate({ vertexColors: true, side: THREE.DoubleSide }))
}

/** Dorsal: cresta alta y redonda. Sube 0.39 del alto del cuerpo, como en la medicion. */
function velaDorsal(): THREE.Shape {
  const h = ALTO * 0.39 + ALTO * 0.14 // lo que sobresale + lo que se hunde en el lomo
  const s = new THREE.Shape()
  s.moveTo(0.56, 0)
  s.bezierCurveTo(0.52, h * 0.58, 0.32, h * 0.98, 0.02, h)
  s.bezierCurveTo(-0.28, h * 1.02, -0.46, h * 0.62, -0.66, 0.02)
  s.bezierCurveTo(-0.34, -0.08, 0.26, -0.09, 0.56, 0)
  return s
}

/** Caudal bifurcada: dos lobulos apuntados con muesca. Es la aleta mas grande. */
function velaCaudal(): THREE.Shape {
  const h = ALTO * 0.52
  const s = new THREE.Shape()
  s.moveTo(0, ALTO * 0.1)
  s.bezierCurveTo(-0.24, h * 0.7, -0.5, h * 0.98, -0.72, h)
  s.bezierCurveTo(-0.56, h * 0.5, -0.4, h * 0.16, -0.3, 0)
  s.bezierCurveTo(-0.4, -h * 0.16, -0.56, -h * 0.5, -0.72, -h)
  s.bezierCurveTo(-0.5, -h * 0.98, -0.24, -h * 0.7, 0, -ALTO * 0.1)
  s.lineTo(0, ALTO * 0.1)
  return s
}

/** Pala redondeada, para pectorales, pelvicas y anal. */
function pala(largo: number, ancho: number): THREE.Shape {
  const s = new THREE.Shape()
  s.moveTo(0, ancho * 0.44)
  s.bezierCurveTo(largo * 0.44, ancho * 1.02, largo * 0.9, ancho * 0.48, largo, 0)
  s.bezierCurveTo(largo * 0.88, -ancho * 0.42, largo * 0.4, -ancho * 0.74, 0, -ancho * 0.44)
  s.bezierCurveTo(-largo * 0.07, 0, -largo * 0.07, 0, 0, ancho * 0.44)
  return s
}

/** Ojo: esclerotica que SOBRESALE del contorno, pupila pulida y brillo. */
function ojo(lado: number): THREE.Group {
  const g = new THREE.Group()

  g.add(new THREE.Mesh(new THREE.SphereGeometry(OJO_R, 40, 30), mate({ color: '#fdfdfb', roughness: 0.4 })))

  const pupila = new THREE.Mesh(
    new THREE.SphereGeometry(OJO_R * 0.62, 34, 26),
    // Lo unico pulido de la pieza: es lo que le da vida a la cara.
    new THREE.MeshStandardMaterial({ color: '#0f0e0d', roughness: 0.08, metalness: 0.04 }),
  )
  pupila.position.set(OJO_R * 0.28, 0, OJO_R * 0.4 * lado)
  g.add(pupila)

  const brillo = new THREE.Mesh(
    new THREE.SphereGeometry(OJO_R * 0.18, 18, 14),
    new THREE.MeshBasicMaterial({ color: '#ffffff' }),
  )
  brillo.position.set(OJO_R * 0.42, OJO_R * 0.38, OJO_R * 0.66 * lado)
  g.add(brillo)

  g.position.set(OJO_X, OJO_Y, muestrear(ANCHO, OJO_X) * 0.62 * lado)
  return g
}

/**
 * El nado va en el VERTEX SHADER: una onda recorriendo el cuerpo tocaria ~20.000 posiciones
 * por frame desde la CPU. La amplitud crece hacia la cola — constante, el pez se desplazaria
 * de lado como una tabla. Y la FRECUENCIA va emparejada a la velocidad de avance: si el
 * cuerpo corre y la cola bate lento, parece deslizarse en vez de propulsarse.
 */
function ondular(mat: THREE.Material, reloj: { value: number }, amplitud: number) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = reloj
    shader.uniforms.uAmp = { value: amplitud }
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform float uTime;\nuniform float uAmp;')
      .replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
         float cola = pow(clamp((1.0 - transformed.x) * 0.5, 0.0, 1.0), 2.0);
         transformed.z += sin(transformed.x * 2.7 - uTime * 11.0) * uAmp * cola;`,
      )
  }
}

export interface Goldfish {
  grupo: THREE.Group
  reloj: { value: number }
}

export function crearGoldfish(): Goldfish {
  const grupo = new THREE.Group()
  const reloj = { value: 0 }

  const cuerpoMesh = cuerpo()
  ondular(cuerpoMesh.material as THREE.Material, reloj, ALTO * 0.16)
  grupo.add(cuerpoMesh)

  // Las aletas se HUNDEN en el cuerpo a proposito: apoyadas justo encima del contorno se
  // ven como piezas pegadas. El solape es lo que las hace nacer del pez.
  const dorsal = aleta(velaDorsal())
  dorsal.position.set(0.05, muestrear(LOMO, 0.05) * K - ALTO * 0.12, 0)
  grupo.add(dorsal)

  const cola = aleta(velaCaudal())
  cola.position.set(-0.9, 0, 0)
  ondular(cola.material as THREE.Material, reloj, ALTO * 0.16)
  grupo.add(cola)

  // Pectorales: grandes, a los lados. Despues de la dorsal son las mas visibles.
  for (const l of [1, -1]) {
    const p = aleta(pala(ALTO * 0.5, ALTO * 0.22), 0.8)
    p.position.set(0.22, -ALTO * 0.3, muestrear(ANCHO, 0.22) * 0.86 * l)
    p.rotation.set(0, (Math.PI / 2.4) * l, Math.PI * 0.8)
    grupo.add(p)
  }

  // Pelvicas: bajan 0.31 del alto bajo el vientre, como en la medicion.
  for (const l of [1, -1]) {
    const p = aleta(pala(ALTO * 0.34, ALTO * 0.15), 0.7)
    p.position.set(-0.08, -muestrear(VIENTRE, -0.08) * K + ALTO * 0.06, 0.1 * l)
    p.rotation.set(0.45 * l, 0, Math.PI * 0.74)
    grupo.add(p)
  }

  const anal = aleta(pala(ALTO * 0.3, ALTO * 0.14), 0.7)
  anal.position.set(-0.56, -muestrear(VIENTRE, -0.56) * K + ALTO * 0.04, 0)
  anal.rotation.z = Math.PI * 0.84
  grupo.add(anal)

  for (const l of [1, -1]) grupo.add(ojo(l))

  return { grupo, reloj }
}
