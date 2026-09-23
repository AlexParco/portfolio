import { profile } from '../data/profile'
import { useLang } from '../i18n/useLang'

export function Footer(): React.JSX.Element {
  const { t, tr } = useLang()

  return (
    <footer className="mt-24 flex flex-col-reverse gap-y-3 border-t border-rule py-8 text-[0.875rem] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
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
    </footer>
  )
}
