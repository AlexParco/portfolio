import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { slug } from '../lib/headings'
import { useLang } from '../i18n/useLang'
import { UI } from '../i18n/ui'
import type { Lang } from '../i18n/lang'

const MEASURE = 'max-w-prose'

// Todo el sitio es mono, asi que la familia ya no distingue metadato de codigo: lo hace
// la SUPERFICIE. El metadato nunca lleva fondo; el codigo siempre lleva `bg-surface` +
// hairline. Esa es la unica senal semantica, y por eso no se usa de adorno en nada mas.
// Prose siempre se monta dentro de un <Section>, cuya etiqueta de canaleta ya es un
// <h2>. Los niveles del markdown se desplazan para colgar POR DEBAJO de esa etiqueta:
// sin esto los `##` del cuerpo serian hermanos suyos y un lector de pantalla los oiria
// como secciones nuevas de la pagina. Un `#` tampoco puede emitir un segundo <h1>.
const build = (lang: Lang): Components => ({
  h1: ({ children }) => (
    <h3 className={`${MEASURE} mt-10 mb-3 text-h2 text-ink first:mt-0`}>{children}</h3>
  ),
  // El `id` se deriva del texto con el MISMO slug que usa el indice lateral. Si las dos
  // partes lo calcularan distinto, los enlaces del indice no llevarian a ninguna parte.
  h2: ({ children }) => (
    <h3
      id={typeof children === 'string' ? slug(children) : undefined}
      className={`${MEASURE} mt-10 mb-3 scroll-mt-8 text-h2 text-ink first:mt-0`}
    >
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className={`${MEASURE} mt-10 mb-3 text-title text-ink first:mt-0`}>{children}</h4>
  ),
  h4: ({ children }) => (
    <h5 className={`${MEASURE} mt-8 mb-3 text-title text-ink first:mt-0`}>{children}</h5>
  ),
  p: ({ children }) => <p className={`${MEASURE} mb-5 text-body`}>{children}</p>,
  ul: ({ children }) => (
    <ul className={`${MEASURE} mb-5 list-disc pl-5 text-body`}>{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className={`${MEASURE} mb-5 list-decimal pl-5 text-body`}>{children}</ol>
  ),
  li: ({ children }) => (
    <li className="my-1.5 marker:text-micro marker:text-ink-muted">
      {children}
    </li>
  ),
  a: ({ href, children }) => {
    const external = /^https?:/.test(href ?? '')
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className="text-accent underline decoration-1 underline-offset-[3px] active:opacity-70"
      >
        {children}
        {external && (
          <span className="sr-only"> {UI.nuevaPestana[lang]}</span>
        )}
      </a>
    )
  },
  strong: ({ children }) => <strong className="font-medium">{children}</strong>,
  em: ({ children }) => <em className="not-italic text-ink-muted">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className={`${MEASURE} my-7 border-l-2 border-accent pl-5 text-ink-muted`}>
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-10 border-0 border-t border-rule" />,
  code: ({ children }) => (
    <code className="rounded-sharp bg-surface px-[0.4em] py-[0.15em] text-[0.925em] text-ink">
      {children}
    </code>
  ),
  // El bloque de codigo rompe la reticula y hace scroll propio: el body nunca
  // scrollea en horizontal. El reset de `> code` anula la superficie del inline.
  // tabIndex={0}: una region con scroll debe ser alcanzable por teclado, o el codigo
  // que desborda solo se puede leer con raton.
  pre: ({ children }) => (
    <pre
      tabIndex={0}
      role="region"
      aria-label={UI.bloqueCodigo[lang]}
      className="grid-bleed my-7 max-w-full overflow-x-auto rounded-sharp border border-rule bg-surface p-5 text-micro leading-[1.7] text-ink [tab-size:2] [&>code]:rounded-none [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[length:inherit]"
    >
      {children}
    </pre>
  ),
  // El scroll va en un envoltorio: un `display:block` sobre la <table> le quitaria
  // su rol de tabla en el arbol de accesibilidad.
  table: ({ children }) => (
    <div tabIndex={0} role="region" aria-label={UI.tabla[lang]} className="my-6 max-w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse text-body">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th
      scope="col"
      className="border-b border-rule pt-3 pr-4 pb-3 text-left text-micro font-medium text-ink-muted"
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-b border-rule pt-3 pr-4 pb-3 align-top">{children}</td>
  ),
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
    <div className="text-body text-ink">
      <Markdown remarkPlugins={[remarkGfm]} components={componentsFor(lang)}>
        {children}
      </Markdown>
    </div>
  )
}
