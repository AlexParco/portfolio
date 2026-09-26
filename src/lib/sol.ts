/**
 * Donde esta el sol ahora mismo, en coordenadas del viewport.
 *
 * Lo escribe `Ball` en cada frame y lo lee quien quiera reaccionar a el (el nombre del
 * hero se ilumina segun su posicion). Es un objeto mutable y no estado de React a
 * proposito: cambia 60 veces por segundo y nadie necesita re-renderizar por eso.
 */
export const sol = {
  x: 0,
  y: 0,
  /** px/s, derivada de la posicion frame a frame (sirve tambien mientras se arrastra). */
  vx: 0,
  vy: 0,
  visible: false,
}

/**
 * Algo contra lo que el sol choca: una caja en coordenadas del viewport y que hacer cuando
 * la golpea. `nx, ny` es la normal del choque, apuntando de la caja hacia el sol.
 */
export interface Solido {
  id: string
  l: number
  t: number
  r: number
  b: number
  golpe: (vx: number, vy: number, nx: number, ny: number) => void
}

/**
 * Los solidos vivos, agrupados por quien los publica (p. ej. 'nombre'). Cada dueno
 * reemplaza su lista en cada frame y la borra al desmontarse.
 */
export const solidos = new Map<string, Solido[]>()
