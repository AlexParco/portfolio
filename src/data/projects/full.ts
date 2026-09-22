import type { Project } from '../types'
import { projects as meta } from './index'
import { ES } from './es'
import { EN } from './en'

/**
 * Cose los metadatos con la prosa de los dos idiomas. El emparejado se hace por slug, y
 * `TextosProyecto` obliga a que ambos ficheros tengan todos los slugs: si falta uno, no
 * compila, asi que este `map` no puede producir un hueco vacio en tiempo de ejecucion.
 *
 * Importar ESTE modulo arrastra los cinco cuerpos en los dos idiomas. Por eso solo lo
 * importa la pagina de detalle, que ya va en un chunk diferido; la portada se queda con
 * `./index`.
 */
export const projects: Project[] = meta.map((p) => ({
  ...p,
  decision: {
    problem: { es: ES[p.slug].decision.problem, en: EN[p.slug].decision.problem },
    choice: { es: ES[p.slug].decision.choice, en: EN[p.slug].decision.choice },
    tradeoff: { es: ES[p.slug].decision.tradeoff, en: EN[p.slug].decision.tradeoff },
  },
  diagram: { es: ES[p.slug].diagram, en: EN[p.slug].diagram },
  body: { es: ES[p.slug].body, en: EN[p.slug].body },
}))
