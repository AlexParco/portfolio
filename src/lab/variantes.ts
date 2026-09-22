import * as THREE from 'three'

/**
 * Cuatro construcciones distintas del pez, para comparar y elegir. NO son variaciones de
 * parametros sobre la misma geometria: cada una parte de una tecnica diferente, porque el
 * problema hasta ahora era justo ese — se parcheaba una base que no daba la silueta.
 */

export const PALETA = {
  lomo: '#ffdc6a',
  cuerpo: '#fbcf35',
  vientre: '#e08a06',
  cola: '#f9a52c',
  aleta: '#f8763a',
  aletaBase: '#fb9a45',
}

export function mate(opts: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0, ...opts })
}

/** Ojo comun a todas las variantes: es lo unico que ya funcionaba. */
export function ojo(lado: number, r = 0.33): THREE.Group {
  const g = new THREE.Group()
  g.add(new THREE.Mesh(new THREE.SphereGeometry(r, 36, 28), mate({ color: '#fdfdfb', roughness: 0.42 })))
  const p = new THREE.Mesh(
    new THREE.SphereGeometry(r * 0.64, 30, 22),
    new THREE.MeshStandardMaterial({ color: '#0f0e0d', roughness: 0.09 }),
  )
  p.position.set(r * 0.26, 0, r * 0.36 * lado)
  g.add(p)
  const b = new THREE.Mesh(new THREE.SphereGeometry(r * 0.17, 16, 12), new THREE.MeshBasicMaterial({ color: '#fff' }))
  b.position.set(r * 0.4, r * 0.35, r * 0.6 * lado)
  g.add(b)
  return g
}

function aletaPlana(shape: THREE.Shape, grosor = 0.05, bisel = 0.075): THREE.Mesh {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: grosor, bevelEnabled: true, bevelSize: bisel,
    bevelThickness: bisel * 0.75, bevelSegments: 6, curveSegments: 26,
  })
  g.center()
  return new THREE.Mesh(g, mate({ color: PALETA.aleta, side: THREE.DoubleSide }))
}

function pala(largo: number, ancho: number): THREE.Shape {
  const s = new THREE.Shape()
  s.moveTo(0, ancho * 0.4)
  s.bezierCurveTo(largo * 0.4, ancho, largo * 0.9, ancho * 0.5, largo, 0)
  s.bezierCurveTo(largo * 0.9, -ancho * 0.4, largo * 0.4, -ancho * 0.7, 0, -ancho * 0.4)
  return s
}

// ─── A · BOLAS ──────────────────────────────────────────────────────────────
/**
 * El cuerpo es un RACIMO DE ESFERAS solapadas: cabeza grande, tronco, y una menor hacia la
 * cola. Es como se modela un personaje de plastilina — masas que se funden— y a tamano
 * pequeno la silueta sale blanda sin depender de ningun perfil fino.
 */
export function bolas(): THREE.Group {
  const g = new THREE.Group()
  const masas: [number, number, number, number, string][] = [
    [0.42, 0.02, 0, 0.62, PALETA.cuerpo], // cabeza
    [-0.12, -0.04, 0, 0.55, PALETA.cuerpo], // tronco
    [-0.56, -0.02, 0, 0.34, PALETA.cola], // hacia la cola
    [-0.84, 0, 0, 0.17, PALETA.cola], // pedunculo
    [0.5, -0.3, 0, 0.42, PALETA.vientre], // panza
  ]
  for (const [x, y, z, r, color] of masas) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 34, 26), mate({ color }))
    m.position.set(x, y, z)
    m.scale.z = 0.62 // comprimido lateralmente, como todo pez
    g.add(m)
  }

  const dorsal = aletaPlana(pala(0.8, 0.44))
  dorsal.position.set(0.02, 0.62, 0)
  dorsal.rotation.z = Math.PI * 0.62
  g.add(dorsal)

  const cola = aletaPlana(pala(0.66, 0.5))
  cola.position.set(-1.02, 0, 0)
  cola.rotation.z = Math.PI
  g.add(cola)

  for (const l of [1, -1]) {
    const p = aletaPlana(pala(0.5, 0.24))
    p.position.set(0.2, -0.34, 0.34 * l)
    p.rotation.set(0, (Math.PI / 2.4) * l, Math.PI * 0.8)
    g.add(p)
  }
  for (const l of [1, -1]) {
    const o = ojo(l, 0.3)
    o.position.set(0.72, 0.2, 0.3 * l)
    g.add(o)
  }
  return g
}

// ─── B · TORNO ──────────────────────────────────────────────────────────────
/**
 * El cuerpo es una REVOLUCION (LatheGeometry) de un perfil dibujado a mano, luego aplastada
 * en Z. Da la silueta mas limpia y controlable de las cuatro: se ajusta moviendo puntos del
 * perfil y no hay costuras ni facetas.
 */
export function torno(): THREE.Group {
  const g = new THREE.Group()

  // Perfil: [distancia al eje, posicion a lo largo]. De la cola (-1) al morro (+1).
  const pts: [number, number][] = [
    [0.02, -1.0], [0.13, -0.84], [0.26, -0.66], [0.42, -0.46], [0.6, -0.24],
    [0.76, 0.0], [0.88, 0.22], [0.95, 0.44], [0.92, 0.64], [0.76, 0.8],
    [0.5, 0.92], [0.2, 0.99], [0.01, 1.0],
  ]
  const perfil = pts.map(([r, y]) => new THREE.Vector2(r, y))
  const geo = new THREE.LatheGeometry(perfil, 64)
  geo.rotateZ(-Math.PI / 2) // el eje de revolucion pasa a X
  geo.scale(1, 0.92, 0.6)

  const pos = geo.attributes.position
  const colores: number[] = []
  const lomo = new THREE.Color(PALETA.lomo)
  const cuerpo = new THREE.Color(PALETA.cuerpo)
  const vientre = new THREE.Color(PALETA.vientre)
  const colaC = new THREE.Color(PALETA.cola)
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const t = THREE.MathUtils.clamp((0.2 - x) / 1.1, 0, 1)
    const c = (y >= 0 ? lomo : cuerpo)
      .clone()
      .lerp(vientre, THREE.MathUtils.clamp(-y * 1.6, 0, 1) * 0.8)
      .lerp(colaC, Math.pow(t, 1.4) * 0.8)
    colores.push(c.r, c.g, c.b)
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colores, 3))
  geo.computeVertexNormals()
  g.add(new THREE.Mesh(geo, mate({ vertexColors: true })))

  const dorsal = aletaPlana(pala(0.86, 0.46))
  dorsal.position.set(0.0, 0.6, 0)
  dorsal.rotation.z = Math.PI * 0.6
  g.add(dorsal)

  const cola = aletaPlana(pala(0.7, 0.52))
  cola.position.set(-1.06, 0, 0)
  cola.rotation.z = Math.PI
  g.add(cola)

  for (const l of [1, -1]) {
    const p = aletaPlana(pala(0.52, 0.26))
    p.position.set(0.18, -0.36, 0.32 * l)
    p.rotation.set(0, (Math.PI / 2.4) * l, Math.PI * 0.8)
    g.add(p)
  }
  for (const l of [1, -1]) {
    const o = ojo(l, 0.31)
    o.position.set(0.66, 0.24, 0.28 * l)
    g.add(o)
  }
  return g
}

// ─── C · CAPSULA ────────────────────────────────────────────────────────────
/**
 * Cuerpo = una CAPSULA deformada. Es la construccion mas simple posible y por eso la mas
 * robusta a tamano pequeno: sin perfiles ni tablas, solo una forma primitiva estirada.
 * Sirve de control — si a 70px se ve igual de bien que las demas, las demas sobran.
 */
export function capsula(): THREE.Group {
  const g = new THREE.Group()
  const geo = new THREE.CapsuleGeometry(0.62, 0.8, 18, 40)
  geo.rotateZ(Math.PI / 2)
  const pos = geo.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    // Afila hacia la cola y engorda la cabeza.
    const k = THREE.MathUtils.clamp((x + 1.1) / 2.2, 0, 1)
    const f = 0.28 + Math.pow(k, 0.8) * 0.95
    pos.setY(i, pos.getY(i) * f)
    pos.setZ(i, pos.getZ(i) * f * 0.6)
  }
  geo.computeVertexNormals()
  g.add(new THREE.Mesh(geo, mate({ color: PALETA.cuerpo })))

  const dorsal = aletaPlana(pala(0.74, 0.42))
  dorsal.position.set(0.0, 0.56, 0)
  dorsal.rotation.z = Math.PI * 0.62
  g.add(dorsal)

  const cola = aletaPlana(pala(0.64, 0.48))
  cola.position.set(-1.0, 0, 0)
  cola.rotation.z = Math.PI
  g.add(cola)

  for (const l of [1, -1]) {
    const o = ojo(l, 0.29)
    o.position.set(0.7, 0.2, 0.26 * l)
    g.add(o)
  }
  return g
}

// ─── D · SILUETA ────────────────────────────────────────────────────────────
/**
 * El pez entero es UNA silueta plana extruida con bisel: cuerpo y aletas en un solo
 * contorno. Es lo mas barato y lo que mejor aguanta a tamano diminuto, porque la lectura
 * no depende del sombreado sino del recorte. Pierde el volumen al girar.
 */
export function silueta(): THREE.Group {
  const g = new THREE.Group()
  const s = new THREE.Shape()
  s.moveTo(1.0, -0.02)
  s.bezierCurveTo(0.9, 0.5, 0.6, 0.72, 0.34, 0.74) // frente y lomo
  s.lineTo(0.16, 1.16) // dorsal
  s.lineTo(-0.24, 0.72)
  s.bezierCurveTo(-0.5, 0.6, -0.66, 0.44, -0.78, 0.28)
  s.lineTo(-1.24, 0.74) // lobulo superior de la cola
  s.lineTo(-1.06, 0.0)
  s.lineTo(-1.24, -0.74) // lobulo inferior
  s.lineTo(-0.78, -0.28)
  s.bezierCurveTo(-0.6, -0.5, -0.4, -0.66, -0.2, -0.72)
  s.lineTo(-0.1, -1.08) // ventral
  s.lineTo(0.24, -0.7)
  s.bezierCurveTo(0.6, -0.66, 0.9, -0.44, 1.0, -0.02)

  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.16, bevelEnabled: true, bevelSize: 0.12,
    bevelThickness: 0.1, bevelSegments: 8, curveSegments: 30,
  })
  geo.center()

  const pos = geo.attributes.position
  const colores: number[] = []
  const cuerpo = new THREE.Color(PALETA.cuerpo)
  const aleta = new THREE.Color(PALETA.aleta)
  const vientre = new THREE.Color(PALETA.vientre)
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    // Lo que cae fuera del ovalo del cuerpo se pinta de aleta.
    const dentro = (x / 0.95) ** 2 + (y / 0.72) ** 2 < 1
    const c = dentro
      ? cuerpo.clone().lerp(vientre, THREE.MathUtils.clamp(-y * 1.4, 0, 1) * 0.8)
      : aleta.clone()
    colores.push(c.r, c.g, c.b)
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colores, 3))
  geo.computeVertexNormals()
  g.add(new THREE.Mesh(geo, mate({ vertexColors: true, side: THREE.DoubleSide })))

  for (const l of [1, -1]) {
    const o = ojo(l, 0.28)
    o.position.set(0.62, 0.2, 0.2 * l)
    g.add(o)
  }
  return g
}
