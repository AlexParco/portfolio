import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { slug } from '../lib/headings'
import { useLang } from '../i18n/useLang'
import { UI } from '../i18n/ui'
import type { Lang } from '../i18n/lang'

// El post cuelga de un unico <h1> (el titular de ArticleHead). Un `#` del markdown no
// puede emitir un segundo <h1>, asi que baja a <h2> igual que `##`.
const build = (lang: Lang): Components => ({
  h1: ({ children }) => <h2 className="mt-12 mb-4 text-h2 text-ink first:mt-0">{children}</h2>,
  // El `id` se deriva del texto: permite enlazar a un apartado con #ancla.
  h2: ({ children }) => (
    <h2
      id={typeof children === 'string' ? slug(children) : undefined}
      className="mt-12 mb-4 scroll-mt-8 text-h2 text-ink first:mt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ children }) => <h3 className="mt-10 mb-3 text-title font-semibold text-ink">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-8 mb-3 text-title text-ink">{children}</h4>,
  p: ({ children }) => <p className="mb-6">{children}</p>,
  ul: ({ children }) => <ul className="mb-6 list-disc pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mb-6 list-decimal pl-5">{children}</ol>,
  li: ({ children }) => <li className="my-1.5 pl-1 marker:text-ink-faint">{children}</li>,
  a: ({ href, children }) => {
    const external = /^https?:/.test(href ?? '')
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="link"
      >
        {children}
        {external && <span className="sr-only"> {UI.nuevaPestana[lang]}</span>}
      </a>
    )
  },
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="my-8 border-l-2 border-accent pl-5 text-ink-muted [&>p]:mb-0">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-0 border-t border-rule" />,
  code: ({ children }) => (
    <code className="rounded-md bg-surface px-[0.35em] py-[0.1em] font-mono text-[0.875em] text-ink">
      {children}
    </code>
  ),
  // El bloque de codigo hace scroll propio: el body nunca scrollea en horizontal. El
  // reset de `> code` anula la superficie del inline. tabIndex={0}: una region con scroll
  // debe ser alcanzable por teclado.
  pre: ({ children }) => (
    <pre
      tabIndex={0}
      role="region"
      aria-label={UI.bloqueCodigo[lang]}
      className="my-8 max-w-full overflow-x-auto rounded-xl bg-surface p-5 font-mono text-[0.8125rem] leading-[1.7] text-ink [tab-size:2] [&>code]:rounded-none [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[length:inherit]"
    >
      {children}
    </pre>
  ),
  // El scroll va en un envoltorio: un `display:block` sobre la <table> le quitaria
  // su rol de tabla en el arbol de accesibilidad.
  table: ({ children }) => (
    <div tabIndex={0} role="region" aria-label={UI.tabla[lang]} className="my-8 max-w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse text-[0.9375rem]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th scope="col" className="border-b border-rule py-2.5 pr-4 text-left font-medium text-ink">
      {children}
    </th>
  ),
  td: ({ children }) => <td className="border-b border-rule py-2.5 pr-4 align-top text-ink-muted">{children}</td>,
})

// Los mapas de componentes se construyen una vez por idioma, no en cada render: si el
// objeto cambiara de identidad, react-markdown volveria a montar todo el arbol de prosa.
const CACHE: Partial<Record<Lang, Components>> = {}
function componentsFor(lang: Lang): Components {
  return (CACHE[lang] ??= build(lang))
}

export function Prose({ children }: { children: string }): React.JSX.Element {
  const { lang } = useLang()
  return (
    <div className="text-body text-ink/85">
      <Markdown remarkPlugins={[remarkGfm]} components={componentsFor(lang)}>
        {children}
      </Markdown>
    </div>
  )
}
