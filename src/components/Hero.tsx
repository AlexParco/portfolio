import { profile } from '../data/profile'
import { useLang } from '../i18n/useLang'
import { HeroName } from './HeroName'

/**
 * La portada: hero.jpg a todo el ancho con el nombre encima.
 *
 * Rompe la columna con `mx-[calc(50%-50vw)]` en vez de vivir fuera del contenedor: asi la
 * portada sigue siendo una pagina mas dentro de <main> y el shell no necesita saber nada.
 * La cabecera flota encima (ver `Header overlay`), sobre el cielo.
 *
 * El texto va en `cream`, no en `ink`: depende de la foto, no del fondo de la pagina. El
 * bloque del nombre queda por encima del 80% de altura, donde empieza a disolverse la
 * mascara, para que siempre tenga la foto y su velo detras.
 */
export function Hero(): React.JSX.Element {
  const { tr } = useLang()

  return (
    <section
      aria-labelledby="hola"
      className="relative mx-[calc(50%-50vw)] h-[clamp(460px,82vh,820px)] overflow-hidden"
    >
      <div aria-hidden="true" className="hero-fade absolute inset-0">
        <img
          src={`${import.meta.env.BASE_URL}hero.jpg`}
          alt=""
          width={1600}
          height={1002}
          fetchPriority="high"
          decoding="async"
          className="hero-img absolute inset-0 size-full object-cover object-[center_58%]"
        />
        <div className="hero-veil absolute inset-0" />
      </div>

      {/* Donde descansa el sol (Ball.tsx) antes de que nadie lo toque: sobre el horizonte. */}
      <span id="sol" aria-hidden="true" className="absolute top-[21%] left-[70%] size-[30px] sm:top-[14%] sm:left-[72%]" />

      <div className="relative mx-auto flex h-full max-w-page flex-col justify-end px-5 pb-[24%] sm:px-6 sm:pb-[min(24%,12rem)]">
        <p className="font-mono text-meta text-cream-dim">
          {tr(profile.role)} · {tr(profile.location)}
        </p>
        <HeroName id="hola" name={profile.name} />
      </div>
    </section>
  )
}
