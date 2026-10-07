import { profile } from '../data/profile'
import { useLang } from '../i18n/useLang'
import { HeroName } from './HeroName'

/**
 * La portada: un cielo de atardecer dibujado en CSS, a todo el ancho, con el nombre encima.
 *
 * Hubo una foto (hero.jpg) y se quito: era de baja resolucion y muy comprimida, y a todo el
 * ancho se veia blanda. En su lugar, `.hero-sky` reproduce la misma atmosfera con los tokens
 * de la paleta —la luz melocoton arriba donde descansa el sol, disolviendose al verde del
 * fondo—. Es nitido a cualquier resolucion y no pesa nada.
 *
 * Rompe la columna con `mx-[calc(50%-50vw)]` en vez de vivir fuera del contenedor: asi la
 * portada sigue siendo una pagina mas dentro de <main> y el shell no necesita saber nada.
 * La cabecera flota encima (ver `Header overlay`), sobre el cielo.
 *
 * El texto va en `cream`, no en `ink`: es el papel que va sobre el cielo (la mitad baja es
 * oscura), no el del fondo de la pagina.
 */
export function Hero(): React.JSX.Element {
  const { tr } = useLang()

  return (
    <section
      aria-labelledby="hola"
      className="hero-sky relative mx-[calc(50%-50vw)] h-[clamp(400px,68vh,680px)] overflow-hidden"
    >
      {/* Donde descansa el sol (Ball.tsx) antes de que nadie lo toque: en su propio resplandor. */}
      <span id="sol" aria-hidden="true" className="absolute top-[24%] left-[70%] size-[30px] sm:top-[20%] sm:left-[72%]" />

      <div className="relative mx-auto flex h-full max-w-page flex-col justify-end px-5 pb-[14%] sm:px-6 sm:pb-[min(14%,7rem)]">
        <p className="font-mono text-meta text-cream-dim">
          {tr(profile.role)} · {tr(profile.location)}
        </p>
        <HeroName id="hola" name={profile.name} />
      </div>
    </section>
  )
}
