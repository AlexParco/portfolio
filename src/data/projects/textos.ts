/** Los slugs de los proyectos. Es la clave que une metadatos y textos. */
export type SlugProyecto =
  | 'tracking-peru'
  | 'shalom-api-peru'
  | 'nestprobe'
  | 'mnemo'
  | 'tmux-cc-sessions'

/**
 * La prosa LARGA de un proyecto: lo unico que la portada no necesita.
 *
 * El resumen no esta aqui a proposito. Vive con los metadatos, porque el indice lo pinta y
 * el indice es lo primero que se carga; si viviera junto al cuerpo, cargar la portada
 * arrastraria los cinco cuerpos completos EN LOS DOS IDIOMAS al bundle inicial.
 */
export interface TextoProyecto {
  decision: { problem: string; choice: string; tradeoff: string }
  /** Diagrama ASCII. Cadena vacia si no aplica. Sus rotulos tambien son texto. */
  diagram: string
  /** Markdown. */
  body: string
}

/**
 * `Record` sobre la union de slugs, no sobre `string`: si se anade un proyecto y se olvida
 * su version inglesa, el error salta al compilar y no en produccion con un hueco en blanco.
 */
export type TextosProyecto = Record<SlugProyecto, TextoProyecto>
