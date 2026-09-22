import { SpecGrid, SpecCell } from './Spec'
import { profile } from '../data/profile'
import { useLang } from '../i18n/useLang'

/** El pie es otra caja de especificacion: cierra la hoja con el mismo lenguaje que la abre. */
export function SheetFoot(): React.JSX.Element {
  const { t, tr } = useLang()
  return (
    <footer className="mt-24">
      <SpecGrid>
        <SpecCell label={t('contacto')}>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {profile.socials.map((social) => {
              const external = !social.url.startsWith('mailto:')
              return (
                <li key={social.label}>
                  <a
                    href={social.url}
                    className="text-ink underline"
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {external
                      ? social.url.replace(/^https?:\/\//, '')
                      : social.url.replace('mailto:', '')}
                    {external && <span className="sr-only"> {t('nuevaPestana')}</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </SpecCell>
        <SpecCell label={t('emision')}>
          {tr(profile.location)} · {new Date().getFullYear()}
        </SpecCell>
      </SpecGrid>
    </footer>
  )
}
