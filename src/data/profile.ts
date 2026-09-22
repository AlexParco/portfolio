import type { L } from '../i18n/lang'

export const profile = {
  // El nombre no se traduce, evidentemente. Tampoco el handle ni el archivo del CV.
  name: 'Alexander Parco Flores',
  cv: 'cv-alexander-parco.pdf',

  role: { es: 'Desarrollador full-stack', en: 'Full-stack developer' } satisfies L,
  location: { es: 'Lima, Perú', en: 'Lima, Peru' } satisfies L,

  /**
   * La presentacion del hero: quien eres, en una frase. Va bajo el nombre y responde lo
   * siguiente que se pregunta quien entra — de donde, que puesto, cuanto tiempo.
   *
   * NO es una declaracion de lo que construyes: eso describe el trabajo, no a la persona, y
   * en un portfolio el hero presenta a la persona. Tampoco copia la caja de identificacion,
   * que dice puesto y lugar en versalita; aqui van los mismos datos dentro de una frase, con
   * los anos, que la caja no lleva.
   */
  intro: {
    es: 'Tres años en desarrollo full-stack desde Lima, Perú. Trabajo sobre todo en backend —APIs, servicios y microservicios en producción— y también en las interfaces que los consumen.',
    en: 'Three years in full-stack development from Lima, Peru. I work mostly on the backend —APIs, services and microservices in production— and also on the interfaces that consume them.',
  } satisfies L,

  /**
   * PERFIL, no trayectoria. Dice COMO DECIDE, y cada afirmacion se apoya en algo verificable
   * que esta en este mismo sitio: las herramientas que escribio para si mismo, la eleccion
   * de texto plano sobre base de datos en mnemo, el registro de decision de cada ficha.
   *
   * Regla: nada de biografia inventada. Si una frase no se puede sostener con un repo o con
   * una decision documentada, no se escribe.
   *
   * La version inglesa conserva el REGISTRO, no la literalidad: es prosa personal, y una
   * traduccion palabra por palabra la deja sonando a manual.
   */
  bio: {
    es: `Escribo mis propias herramientas. Cuando algo del día a día me estorba —no poder ver los handlers de un microservicio, perder el hilo entre sesiones abiertas, reexplicarle el contexto a un agente cada mañana— acabo construyendo la pieza que falta en vez de acostumbrarme. Tres de los proyectos de aquí nacieron así.

Me interesa más el porqué de una decisión que la decisión. Un README te dice qué hace algo; casi nunca te dice qué alternativa se descartó ni qué se pagó a cambio, que es justo lo que necesitas cuando llega el momento de cambiarlo. Por eso cada proyecto de este sitio lleva su registro de decisión, con el precio incluido.

Prefiero lo que puedo abrir y arreglar. Para mi memoria de agentes elegí archivos de texto en git antes que una base de datos sabiendo que perdía índices y búsqueda; a cambio la leo con cualquier editor y la arreglo a mano cuando se rompe. Ese trueque lo hago a menudo, y no siempre es el correcto.

Y me gusta operar lo que construyo. Diseñar una API es cómodo hasta que eres tú quien contesta cuando se cae de madrugada.`,
    en: `I write my own tools. When something in the day-to-day gets in my way —not being able to see a microservice’s handlers, losing track across open sessions, re-explaining context to an agent every morning— I end up building the missing piece instead of getting used to it. Three of the projects here started that way.

I’m more interested in the why behind a decision than in the decision. A README tells you what something does; it almost never tells you which alternative was dropped or what was paid for it, which is exactly what you need when the time comes to change it. That’s why every project here carries its decision record, price included.

I prefer things I can open and fix. For my agent memory I chose plain text files in git over a database, knowing I was giving up indexes and search; in exchange I can read it in any editor and fix it by hand when it breaks. I make that trade often, and it isn’t always the right one.

And I like operating what I build. Designing an API is comfortable until you’re the one answering when it goes down at 3am.`,
  } satisfies L,

  socials: [
    { label: 'GitHub', url: 'https://github.com/AlexParco' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/alexparcof' },
    { label: 'Email', url: 'mailto:alexparco16@gmail.com' },
  ],
}
