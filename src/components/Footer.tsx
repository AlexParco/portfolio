import { useEffect, useState } from 'react'
import { profile } from '../data/profile'
import { useLang } from '../i18n/useLang'

/**
 * El pie es tambien la "porteria" del sol (Ball.tsx): si cae aqui, aparece un mensaje
 * con el contacto. Es un premio para quien juega, no un contenido: el mismo email y CV
 * estan en la portada y en /about para quien no juega.
 */
export function Footer(): React.JSX.Element {
  const { t, tr } = useLang()
  const [gol, setGol] = useState(false)
  const email = profile.socials.find((s) => s.url.startsWith('mailto:'))

  useEffect(() => {
    const onGoal = () => setGol(true)
    window.addEventListener('ball:goal', onGoal)
    return () => window.removeEventListener('ball:goal', onGoal)
  }, [])

  return (
    <footer data-ball-goal className="mt-24 border-t border-rule py-8 text-[0.875rem] text-ink-faint">
      {/* aria-live: el mensaje aparece sin que nadie navegue hasta el, asi se anuncia. */}
      <div aria-live="polite">
        {gol && (
          <p className="enter mb-6 text-[0.9375rem] text-ink-muted">
            <span aria-hidden="true" className="mr-2 inline-block size-2.5 rounded-full bg-accent align-middle shadow-[0_0_10px_2px_var(--color-accent)]" />
            {t('buenTiro')}{' '}
            {email && (
              <a href={email.url} className="link">
                {email.url.replace('mailto:', '')}
              </a>
            )}
            {' · '}
            <a
              href={`${import.meta.env.BASE_URL}${profile.cv}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {t('cv')}
              <span className="sr-only"> {t('pdfNuevaPestana')}</span>
            </a>
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-y-3 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name} · {tr(profile.location)}
        </p>
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {profile.socials.map((social) => {
            const external = !social.url.startsWith('mailto:')
            return (
              <li key={social.label}>
                <a
                  href={social.url}
                  className="transition-colors duration-(--dur-state) hover:text-ink"
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {social.label}
                  {external && <span className="sr-only"> {t('nuevaPestana')}</span>}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </footer>
  )
}
