import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../i18n/useLang'
import { RUTA_INICIO } from '../i18n/lang'
import { ThemeToggle } from './ThemeToggle'
import { LangToggle } from './LangToggle'
import { profile } from '../data/profile'

/**
 * La cabecera de la hoja: la caja de identificacion y, debajo, el titular a cuerpo grande.
 *
 * Sustituye al rail lateral fijo. La referencia es una hoja de especificacion —una sola
 * columna, leida de arriba abajo—, y un panel lateral pegado la convertia en otra cosa.
 *
 * El titular solo aparece en la portada. En una ficha de detalle la cabecera se reduce a la
 * caja: ahi el titular es el del proyecto, y dos titulares compiten.
 */
export function SheetHead(): React.JSX.Element {
  const { t, tr } = useLang()
  const { pathname } = useLocation()
  const isHome = pathname === RUTA_INICIO

  return (
    <header className="relative isolate">
      {isHome && (
        /* El paisaje arranca en el BORDE SUPERIOR de la pagina, no debajo de la caja de
           identificacion: empezar ahi dejaba un canto horizontal visible donde nacia la
           imagen, que es justo lo que la mascara existe para evitar.
           `-top-6 md:-top-10` compensa exactamente el `py-6 md:py-10` del contenedor.

           Pasar por detras de la caja no compromete su texto atenuado: sus tres celdas
           llevan `bg-bg`, son opacas y tapan la foto por completo.

           La ruta se compone aqui y no en el CSS porque la imagen vive en `public/` y Vite
           NO reescribe los `url()` de una hoja de estilos para el `base` del despliegue.
           Hoy `base` es `/` y daria igual, pero se deja compuesta: si el sitio vuelve a
           colgar de un subdirectorio, el CSS se romperia en silencio. */
        <div
          aria-hidden="true"
          className="hero-wash pointer-events-none absolute -top-6 -bottom-28 -z-10 left-1/2 w-screen -translate-x-1/2 md:-top-10"
          style={{
            backgroundImage: `linear-gradient(color-mix(in srgb, var(--color-bg) var(--hero-veil), transparent), color-mix(in srgb, var(--color-bg) var(--hero-veil), transparent)), url(${import.meta.env.BASE_URL}hero.jpg)`,
          }}
        />
      )}

      <div className="border border-rule bg-rule">
        <div className="grid gap-px bg-rule sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto]">
          <Link
            to={RUTA_INICIO}
            className="flex items-center bg-bg px-4 py-3 no-underline"
            aria-label={t('inicioAria')}
          >
            <span className="spec-tag text-ink">alexparco</span>
          </Link>

          <div className="bg-bg px-4 py-3">
            <p className="spec-tag text-ink">{tr(profile.role)}</p>
            <p className="spec-tag text-ink-muted">{tr(profile.location)}</p>
          </div>

          <div className="flex items-center gap-x-4 bg-bg px-4 py-3">
            <a
              href={`${import.meta.env.BASE_URL}${profile.cv}`}
              target="_blank"
              rel="noopener noreferrer"
              className="spec-tag text-ink underline"
            >
              CV <span aria-hidden="true">↓</span>
              <span className="sr-only">{t('pdfNuevaPestana')}</span>
            </a>
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {isHome && (
        <>
          {/* La portada, centrada. El aire de arriba y de abajo NO es relleno: es el vacio
              de la referencia, lo que separa la portada de la ficha y lo unico que le da
              peso al nombre sin subirle el cuerpo. Lo ocupaba la animacion; al quitarla hay
              que reponerlo a mano o el indice se pega al titular. */}
          <div className="mt-20 mb-28 text-center md:mt-32 md:mb-40">
            <h1 className="text-h1 text-ink">{profile.name}</h1>

            <p className="mx-auto mt-8 max-w-[46ch] text-lead text-balance text-ink">
              {tr(profile.intro)}
            </p>

            <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-1 md:hidden">
              {profile.socials.map((social) => (
                <li key={social.label} className="spec-tag">
                  <a
                    href={social.url}
                    className="text-ink underline"
                    {...(social.url.startsWith('mailto:')
                      ? {}
                      : { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </>
      )}
    </header>
  )
}
