import { type ComponentType, Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Ball } from './components/Ball'
import { PageSkeleton } from './components/PageSkeleton'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { useLang } from './i18n/useLang'
import { CLAVE_IDIOMA } from './i18n/lang'
import { profile } from './data/profile'

// Las paginas de detalle arrastran react-markdown (~156kB). Solo el home entra en el
// bundle inicial; el resto se carga en diferido y se PRECARGA en segundo plano.
//
// Por que no basta `React.lazy` a secas: aunque el modulo ya este descargado, `lazy`
// suspende al menos un microtick, y en cuanto React 19 muestra un fallback lo mantiene
// un minimo de ~300 ms para no parpadear. Resultado medido: skeleton y 400 ms de espera
// con el codigo ya en el navegador. Asi que, si la pagina ya esta cargada, se pinta el
// componente directamente y `lazy` solo entra cuando de verdad hay que esperar.
function diferida<M, P extends object>(
  cargar: () => Promise<M>,
  elegir: (m: M) => ComponentType<P>,
): { Pagina: ComponentType<P>; precargar: () => Promise<unknown> } {
  let lista: ComponentType<P> | null = null
  const precargar = () =>
    cargar().then((m) => {
      lista = elegir(m)
      return m
    })
  const Perezosa = lazy(() => precargar().then((m) => ({ default: elegir(m) })))
  function Pagina(props: P): React.JSX.Element {
    const C = lista
    return C ? <C {...props} /> : <Perezosa {...props} />
  }
  return { Pagina, precargar }
}

const proyecto = diferida(() => import('./pages/ProjectDetail'), (m) => m.ProjectDetail)
const nota = diferida(() => import('./pages/SnippetDetail'), (m) => m.SnippetDetail)
const about = diferida(() => import('./pages/About'), (m) => m.About)
const ProjectDetail = proyecto.Pagina
const SnippetDetail = nota.Pagina
const About = about.Pagina

/** Precarga las paginas diferidas cuando el navegador no tiene nada mejor que hacer. */
function usePrecarga(): void {
  useEffect(() => {
    const precargar = () => {
      for (const d of [proyecto, nota, about]) void d.precargar().catch(() => {})
    }
    // Safari no tiene requestIdleCallback.
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(precargar, { timeout: 2000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(precargar, 1000)
    return () => clearTimeout(id)
  }, [])
}

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
    if (!hash) {
      // Salto seco: un scroll suave de 3000px al cambiar de ruta seria peor que ninguno.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return
    }
    // `/#notas` desde otra pagina: la seccion aun no existe en el primer frame. Se
    // reintenta unos frames hasta que monta.
    let intentos = 0
    let frame = 0
    const buscar = () => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else if (intentos++ < 30) frame = requestAnimationFrame(buscar)
    }
    buscar()
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])

  return null
}

/** Una sola columna estrecha, como un blog: cabecera, contenido y pie. */
function Shell(): React.JSX.Element {
  const { pathname } = useLocation()
  const { t } = useLang()
  usePrecarga()

  return (
    <>
      <DocumentMeta />
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:rounded-md focus:bg-bg focus:px-3 focus:py-2 focus:text-ink"
      >
        {t('saltar')}
      </a>

      <div className="relative mx-auto max-w-page px-5 sm:px-6">
        <Header overlay={pathname === '/'} />
        {/* tabIndex=-1: sin esto el skip-link cambia el hash pero no mueve el foco en Safari. */}
        <main id="main" key={pathname} tabIndex={-1} className="enter outline-none">
          <Suspense fallback={<PageSkeleton />}>
            {/* Una sola URL por pieza, con los segmentos SIEMPRE en ingles aunque la
                pagina se lea en castellano. El idioma no entra en la ruta. */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects/:slug" element={<ProjectDetail />} />
              <Route path="/notes/:slug" element={<SnippetDetail />} />
              <Route path="/lab" element={<LabPeces />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <Ball />
    </>
  )
}

export function App(): React.JSX.Element {
  return (
    // useTransitions={false}: React Router 7 navega dentro de startTransition por defecto,
    // y en una transicion React se queda en la pagina VIEJA, sin dar senal, hasta que llega
    // el codigo de la nueva (medido: ~1 s en 4G sin precarga). Sin transicion, el skeleton
    // aparece en cuanto hay que esperar; y si la pagina ya esta precargada no hay espera.
    <BrowserRouter basename={import.meta.env.BASE_URL} useTransitions={false}>
      <Shell />
    </BrowserRouter>
  )
}
