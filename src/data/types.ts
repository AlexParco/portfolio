import type { L } from '../i18n/lang'

/**
 * El registro de una decision de arquitectura. Es lo que distingue a un arquitecto de
 * un implementador: no *que* construiste, sino que alternativas descartaste y que
 * precio aceptaste a cambio. Un ADR de tres lineas.
 */
export interface Decision {
  /** La restriccion o el dolor concreto que forzo la decision. */
  problem: L
  /** Que se eligio, en una frase declarativa. */
  choice: L
  /** El precio que se paga por esa eleccion. Si esto queda vacio, no era una decision. */
  tradeoff: L
}

/**
 * Lo que la PORTADA necesita de un proyecto, y nada mas.
 *
 * La separacion no es estetica: el indice se pinta en el bundle inicial y la ficha de
 * detalle va en un chunk diferido. Con un solo tipo, importar el indice arrastraba los
 * cinco cuerpos completos —en los dos idiomas— a la primera carga.
 */
export interface ProjectMeta {
  slug: string
  /** Nombre propio del proyecto: NO se traduce, es su identidad. */
  title: string
  /** Una linea: que es y para quien. Se muestra en la fila del listado. */
  summary: L
  tags: string[]
  /** Captura. Cadena vacia para las herramientas de CLI, que no tienen UI que mostrar. */
  image: string
  /** Demo o documentacion publica. Cadena vacia = no hay. */
  demo: string
  /** Repositorio. Cadena vacia = no es publico. */
  repo: string
  /** ISO 8601 (YYYY-MM-DD). Se formatea con Intl en el render. */
  date: string
}

/** El proyecto completo: el metadato mas la prosa larga. Solo lo usa la pagina de detalle. */
export interface Project extends ProjectMeta {
  /** El registro de decision. Se renderiza como ficha en el detalle. */
  decision: Decision
  /**
   * Diagrama ASCII del sistema. Cadena vacia si no aplica. Se renderiza en mono.
   * Es `L` porque sus rotulos son texto: un diagrama con las cajas en espanol dentro de
   * una pagina en ingles es la unica parte que se quedaria sin traducir, y se nota.
   */
  diagram: L
  /** Markdown. Se renderiza con <Prose> en el detalle. */
  body: L
}

export interface Job {
  role: L
  /** Nombre propio de la empresa: no se traduce. */
  company: string
  /**
   * Que era el sistema y a que escala, en una linea. Va debajo del cargo: sin esto una
   * entrada de experiencia solo dice donde estuviste, no que sostuviste.
   */
  summary: L
  /**
   * Como maximo tres. Cada una es una decision o un alcance concreto, no una
   * responsabilidad generica: "trabaje en el backend" no dice nada, "ownership sobre
   * diseno, despliegue y estabilidad" si.
   *
   * SIN cifras del empleador. Clientes, facturacion, numero de servicios o tamano de
   * plantilla son datos de la empresa y no se publican aqui; en `projects.ts`, que son
   * proyectos propios, si van con detalle.
   */
  highlights: L<string[]>
  /** ISO 8601 (YYYY-MM). */
  start: string
  /** ISO 8601 (YYYY-MM), o null si sigue vigente. */
  end: string | null
}

export interface Study {
  /** Nombre propio del centro: no se traduce. */
  institution: string
  program: L
  /** Titulacion o estado. */
  status: L
  /** ISO 8601 (YYYY-MM). */
  start: string
  /** ISO 8601 (YYYY-MM). */
  end: string
}

/** Lo que la portada necesita de una nota. Ver `ProjectMeta` sobre por que va separado. */
export interface SnippetMeta {
  slug: string
  title: L
  summary: L
  /**
   * Una nota sin cuerpo no se enlaza. Es un dato explicito y no `content === ''` porque
   * el indice no carga los cuerpos: no puede mirar lo que no tiene.
   */
  draft: boolean
  /** ISO 8601 (YYYY-MM-DD). */
  date: string
}

export interface Snippet extends SnippetMeta {
  /** Markdown. Se renderiza con <Prose>. */
  content: L
}
