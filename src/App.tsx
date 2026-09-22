import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { CursorRing } from './components/CursorRing'
import { SheetHead } from './components/SheetHead'
import { SheetFoot } from './components/SheetFoot'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { useLang } from './i18n/useLang'
import { CLAVE_IDIOMA } from './i18n/lang'
import { profile } from './data/profile'

// Las paginas de detalle arrastran react-markdown (~156kB). Solo el home entra en el
// bundle inicial; el detalle se carga al navegar.
const ProjectDetail = lazy(() =>
  import('./pages/ProjectDetail').then((m) => ({ default: m.ProjectDetail })),
)
const SnippetDetail = lazy(() =>
  import('./pages/SnippetDetail').then((m) => ({ default: m.SnippetDetail })),
)
// Banco de pruebas para elegir el diseno del pez. No esta enlazado desde ninguna parte;
// se llega escribiendo /lab. Va en diferido para que no pese en el bundle inicial, y la
// carpeta src/lab/ se borra entera cuando se decida.
const LabPeces = lazy(() => import('./lab/LabPeces').then((m) => ({ default: m.LabPeces })))

/**
 * Los metadatos del documento siguen al idioma elegido.
 *
 * `<html lang>` no es cosmetico: es lo que decide con que voz lee un lector de pantalla.
 * Con `lang="es"` fijo, la version inglesa se oiria con fonetica espanola y seria
 * practicamente incomprensible. Tambien lo fija el script de `index.html` antes del primer
 * paint; aqui se mantiene al dia cuando el usuario lo cambia en caliente.
 *
 * NO hay `<link rel="alternate" hreflang>`: solo tienen sentido cuando cada idioma tiene su
 * propia URL, y aqui las dos versiones comparten una. Dejarlos apuntando a la misma
 * direccion le estaria diciendo al buscador algo que no es cierto.
 */
function DocumentMeta(): null {
  const { lang, tr } = useLang()

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = `${profile.name} — ${tr(profile.role)}`

    const desc = document.querySelector('meta[name="description"]')
    if (desc) desc.setAttribute('content', tr(profile.intro))

    // El script de arranque lee esto para no parpadear en la siguiente visita.
    try {
      localStorage.setItem(CLAVE_IDIOMA, lang)
    } catch {
      // Modo privado o almacenamiento bloqueado: el idioma dura lo que la sesion.
    }
  }, [lang, tr])

  return null
}

function ScrollToTop(): null {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // El scroll a un ancla lo resuelve Rail, que reintenta hasta que la seccion monta.
    if (hash) return
    // Salto seco: un scroll suave de 3000px al cambiar de ruta seria peor que ninguno.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

/**
 * Una sola columna, como una hoja de especificacion. La v5 tenia dos paneles con la
 * identidad fija a la izquierda; la referencia actual es una hoja que se lee de arriba
 * abajo, y un panel lateral pegado la convertia en otra cosa.
 *
 * La cabecera y el pie viven en el shell —no en cada pagina— para que al abrir un proyecto
 * solo cambie el cuerpo y la caja de identificacion no parpadee.
 */
function Shell(): React.JSX.Element {
  const { pathname } = useLocation()
  const { t } = useLang()

  return (
    <>
      <DocumentMeta />
      <ScrollToTop />
      <CursorRing />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:bg-bg focus:px-3 focus:py-2 focus:font-mono focus:text-meta focus:text-ink"
      >
        {t('saltar')}
      </a>

      <div className="mx-auto max-w-[1120px] px-5 py-6 md:px-10 md:py-10">
        <SheetHead />
        {/* tabIndex=-1: sin esto el skip-link cambia el hash pero no mueve el foco en Safari. */}
        <main id="main" key={pathname} tabIndex={-1} className="enter outline-none">
          <Suspense fallback={null}>
            {/* Una sola URL por pieza, con los segmentos SIEMPRE en ingles aunque la
                pagina se lea en castellano. El idioma no entra en la ruta: se elige en el
                conmutador y se recuerda en el navegador. */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/notes/:slug" element={<SnippetDetail />} />
              <Route path="/lab" element={<LabPeces />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <SheetFoot />
      </div>
    </>
  )
}

export function App(): React.JSX.Element {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell />
    </BrowserRouter>
  )
}
