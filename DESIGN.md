# DISEÑO — Portfolio de Alexander Parco Flores

Este documento describe el **diseño actual** del sitio (`alexanderparco.com`): un portfolio minimalista tipo blog, en una sola columna, modo solo oscuro, con una portada de foto y un "sol" con el que se puede jugar.

> **Reescritura completa (septiembre 2026).** Este documento reemplaza por entero al spec anterior, que describía un sistema visual distinto —una "hoja de especificación" a dos paneles, monocroma, con el idioma viviendo en la URL—. Todo aquello quedó derogado: no busques aquí `SpecRow`, dos paneles, ni rutas con `/en`. El código es la fuente de verdad; este documento lo explica, sección por sección, apoyándose en los archivos reales.

## La idea en una frase

Un paisaje en penumbra (`hero.jpg`) como portada, y el sitio entero como su continuación: paleta sacada de la foto, texto crema sobre verde de bosque, y un único acento melocotón —la luz del horizonte— que solo marca lo que se puede pulsar. Encima, un sol que se agarra, se lanza y choca con las letras del nombre. Debajo, contenido que se lee como un blog: proyectos y notas, cada uno con su **registro de decisión** (problema, elección y el precio que se pagó).

## Mapa del documento

- **§1 — Sistema visual:** tokens de color y tipografía, el modo solo oscuro, la paleta derivada de la foto.
- **§2 — Estructura, rutas y rendimiento:** la columna única, el shell, las páginas, y la precarga + skeleton que hacen que navegar sea instantáneo.
- **§3 — La portada:** el hero, el sol lanzable (física, colisiones, el "gol") y el nombre que se ilumina y choca con el sol.
- **§4 — Contenido, datos e i18n:** el modelo de datos, el registro de decisión, el bilingüe que vive en el navegador, y las páginas de detalle tipo post.
- **§5 — Build y despliegue:** de Vite a nginx en Docker, el Traefik compartido del VPS, y Cloudflare por delante para ocultar la IP.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · react-router-dom 7 · react-i18next · react-markdown. Se despliega como estático (nginx en Docker) sobre un VPS propio, con CI en GitHub Actions (push a `main` → deploy).


## 1. Sistema visual — tokens, tema y tipografía

Todo el sistema visual vive en `src/styles/theme.css`, dentro del bloque `@theme` de Tailwind v4 (el archivo abre con `@import "tailwindcss";`). No hay archivo de configuración JS: los tokens son variables CSS y Tailwind genera las utilidades a partir de ellos.

### 1.1 Modo solo oscuro (paleta única)

El sitio tiene **una sola paleta y es oscura**. No hay tema claro ni conmutador. El comentario en `theme.css` (líneas 4-10) lo deja explícito: hubo un tema claro y se quitó.

El porqué está documentado en el propio código: la portada es una foto de un paisaje en penumbra (`hero.jpg`) y el sitio es su continuación. Con tema claro, la foto disolviéndose hacia el papel crema dejaba "una franja gris sucia" donde la imagen se fundía con el fondo; y sin la foto, el modo claro no tenía nada que ver con la portada. Así que la decisión fue comprometerse con lo oscuro y hacer que todo el color naciera de la foto.

La declaración de modo oscuro es doble y deliberada:

- `:root { color-scheme: dark; }` en CSS (línea 69), para que los controles nativos y las barras de scroll salgan oscuros.
- En `index.html`, dos metas fijas: `<meta name="color-scheme" content="dark" />` y `<meta name="theme-color" content="#0b120d" />` (líneas 17-18). Ese `theme-color` (`#0b120d`, un verde casi negro) es el que pinta la barra del navegador en móvil, alineado con `--color-bg`.

**Trampa:** el `<body>` conserva `transition: background-color var(--dur-state) linear;` (línea 88), una transición de color de fondo que solo tiene sentido si hubiera un cambio de tema. Con paleta única no hace nada visible; es residuo del conmutador retirado.

### 1.2 La paleta — tokens de color

Todos los colores están en `oklch()` y salen de `hero.jpg` (colinas verdes, cielo de tormenta, franja de luz melocotón en el horizonte). El hilo conductor es el matiz verde (~155) para las superficies —"la sombra del bosque"— y el melocotón cálido para el acento —"la luz del horizonte"—.

Fondos y superficies:

| Token | Valor oklch | Papel |
|---|---|---|
| `--color-bg` | `oklch(0.165 0.012 155)` | Fondo de página: la sombra del bosque, verde casi negro. |
| `--color-surface` | `oklch(0.205 0.014 155)` | Superficie elevada: código, diagramas. |
| `--color-bg-hover` | `oklch(0.215 0.015 155)` | Estado hover sobre fondos. |
| `--color-rule` | `oklch(0.275 0.016 155)` | Líneas, reglas y subrayados en reposo. |

Texto (tinta), en escala de contraste decreciente y con el matiz derivando de crema (85) a verdoso (120):

| Token | Valor oklch | Papel |
|---|---|---|
| `--color-ink` | `oklch(0.930 0.022 85)` | Texto principal, crema. Es el `color` por defecto del `body`. |
| `--color-ink-muted` | `oklch(0.740 0.018 100)` | Texto secundario atenuado. |
| `--color-ink-faint` | `oklch(0.590 0.016 120)` | Metadatos, fechas: lo más tenue. |

Acento y auxiliares:

| Token | Valor oklch | Papel |
|---|---|---|
| `--color-accent` | `oklch(0.820 0.085 60)` | El melocotón, la luz del horizonte. **Solo marca lo pulsable y el sol.** |
| `--color-accent-dim` | `oklch(0.740 0.018 100)` | Acento apagado (nótese que coincide con `ink-muted`). |
| `--color-haze` | `oklch(0.700 0 0)` | Gris neutro (croma 0), niebla. |

**El acento no es decoración.** Su regla es que solo aparece en lo que se puede pulsar y en el sol. Se ve en la práctica en:

- `.link:hover` cambia `color` a `--color-accent` y enciende el subrayado (`text-decoration-color: currentColor`); en reposo el enlace es tinta con subrayado `--color-rule`.
- `:focus-visible` dibuja `outline: 2px solid var(--color-accent)`.
- `::selection` usa el acento mezclado al 25% con transparente.
- El sol (`.ball`) y sus animaciones de resplandor, todo en tonos melocotón.

Crema sobre la foto (papel aparte):

| Token | Valor oklch | Papel |
|---|---|---|
| `--color-cream` | `oklch(0.955 0.022 85)` | Texto que va **sobre la foto**. |
| `--color-cream-dim` | `oklch(0.955 0.022 85 / 0.72)` | Igual, al 72% de opacidad. |

**Trampa:** `--color-cream` hoy casi coincide con `--color-ink`, pero el comentario advierte que **son papeles distintos a propósito**: `cream` depende de la foto (contraste contra el cielo de tormenta), no del fondo de la página. Si algún día cambia la foto o el fondo, se mueven por separado; no hay que colapsarlos aunque parezcan el mismo valor.

### 1.3 Tipografía

Dos familias, con una división de trabajo clara: **sans para leer, mono solo para lo que se escanea** (fechas, tags, código).

- `--font-sans`: `"Geist Variable", ui-sans-serif, system-ui, -apple-system, sans-serif`. Es la fuente del `body`.
- `--font-mono`: `"JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, monospace`.

La escala de tamaños (`--text-*`) va de metadato a titular, con line-height —y en algunos casos peso y tracking— empaquetados en el mismo token al estilo Tailwind v4:

| Token | Tamaño | line-height | Extras | Uso |
|---|---|---|---|---|
| `--text-micro` | `0.75rem` (12px) | 1.5 | — | tags (mono) |
| `--text-meta` | `0.8125rem` (13px) | 1.5 | — | fechas, rótulos (mono) |
| `--text-body` | `1rem` (16px) | 1.75 | — | prosa (default del body) |
| `--text-title` | `1rem` (16px) | 1.4 | weight 500 | título de fila |
| `--text-lead` | `1.125rem` (18px) | 1.65 | — | entradilla |
| `--text-h2` | `1.25rem` (20px) | 1.35 | weight 600, tracking -0.01em | apartado dentro de un post |
| `--text-h1` | `clamp(1.75rem, 1.5rem + 1.1vw, 2.25rem)` (28→36px) | 1.15 | weight 600, tracking -0.025em | titular |

Nota: `--text-body` y `--text-title` comparten tamaño (16px); lo que los separa es el line-height (1.75 vs 1.4) y el peso (500 en title). El único tamaño fluido es `--text-h1`, con `clamp` de 28 a 36px.

Ajustes globales de texto: el `body` activa `-webkit-font-smoothing: antialiased` y `text-rendering: optimizeLegibility`; los enlaces llevan `text-underline-offset: 0.22em` y `text-decoration-thickness: 1px`.

### 1.4 Otros tokens del sistema

Además del color y la tipografía, `@theme` define la retícula, los radios y el movimiento:

- `--spacing: 4px` — unidad base de espaciado de Tailwind.
- `--container-page` y `--container-prose`: ambos `42rem` (672px). El comentario lo llama "la columna de todo el sitio": una única columna de lectura.
- `--radius-sharp: 6px` — radio de esquina.
- Movimiento: `--ease-out: cubic-bezier(0.2, 0, 0, 1)`, y tres duraciones — `--dur-state: 150ms` (estados), `--dur-enter: 220ms` (entrada de ruta), `--dur-image: 200ms` (imágenes).

El sistema respeta `prefers-reduced-motion: reduce`: desactiva el scroll suave y colapsa animaciones y transiciones a 0.01ms.

### 1.5 Arranque sin parpadeo

El `<script>` inline de `index.html` es **bloqueante y corre antes del bundle**, es decir antes del primer paint. Un matiz importante: ese script **no fija el tema** (el tema es fijo y oscuro; ya está resuelto por las metas y por `color-scheme: dark`). Lo que fija antes del primer paint es el **idioma**: lee `localStorage.getItem("lang")`, y si no es `"es"` ni `"en"`, cae al idioma del navegador (`navigator.language`), forzando `"es"` como default. Luego escribe `document.documentElement.lang`.

El motivo: el sitio es una SPA con una sola URL para los dos idiomas, así que el HTML estático no sabe de antemano qué idioma toca. El script tiene que **replicar la lógica del detector de i18next** (misma clave `lang`, mismo orden: elección guardada y luego idioma del navegador); si no, `<html lang>` diría una cosa y la página se pintaría en otra durante el primer frame. `lang="es"` en el `<html>` es solo el valor de partida —lo que ve un rastreador sin JavaScript—; el script lo corrige antes del paint y `DocumentMeta` lo mantiene al día en caliente.

Donde sí hay control anti-parpadeo visual es en el **skeleton de carga**: entra con 150ms de retraso (`animation: enter ... 150ms both`), de modo que si el contenido llega antes de 150ms —lo normal con la precarga— el skeleton no se ve nunca y no hay flash.


## 2. Estructura, rutas y rendimiento

### 2.1 Una sola columna, tipo blog

Todo el sitio vive en una única columna estrecha. El armazón está en `src/App.tsx`, en el componente `Shell`, que envuelve el contenido en un solo contenedor centrado:

```
<div className="relative mx-auto max-w-page px-5 sm:px-6">
  <Header overlay={pathname === '/'} />
  <main id="main" key={pathname} tabIndex={-1} className="enter outline-none">…</main>
  <Footer />
</div>
```

`max-w-page` (≈ 42rem) fija el ancho de lectura; `mx-auto` lo centra y `px-5 sm:px-6` da el margen lateral. El orden vertical es siempre el mismo: **Header arriba, `<main>` con las rutas en medio, Footer abajo**. No hay dos paneles ni columnas laterales: es la disposición de un blog.

Detalles del shell, todos en `src/App.tsx`:

- **Skip-link**: un `<a href="#main">` visualmente oculto (`sr-only`) que aparece al recibir foco, para saltar la navegación con teclado.
- **`key={pathname}` en `<main>`**: fuerza a React a remontar el `<main>` en cada cambio de ruta, de modo que la animación de entrada (`.enter`) se dispare en cada página.
- **`tabIndex={-1}` en `<main>`**: sin esto, el skip-link en Safari cambia el hash pero no mueve el foco.
- **`<Ball />`**: queda **fuera** del `<div>` de la columna, porque es un elemento flotante (el sol) que se mueve por toda la pantalla, no contenido de la columna.

**Trampa:** el `Header` en la portada es `overlay` y se saca del flujo con `absolute inset-x-0 top-0`, replicando por su cuenta el mismo `mx-auto max-w-page px-5 sm:px-6`. Si cambias el ancho de la columna, hay que tocarlo en dos sitios: el `<div>` del shell y el `<header>` en modo overlay.

### 2.2 Rutas

Las rutas se declaran en `src/App.tsx`, dentro de `<Routes>`:

| Ruta | Elemento | Origen |
|------|----------|--------|
| `/` | `Home` | importado directo (bundle inicial) |
| `/about` | `About` | diferido |
| `/projects/:slug` | `ProjectDetail` | diferido |
| `/notes/:slug` | `SnippetDetail` | diferido |
| `/lab` | `LabPeces` | diferido, no enlazado desde ningún sitio |
| `*` | `NotFound` | bundle inicial |

Los **segmentos van SIEMPRE en inglés** (`projects`, `notes`, `about`) aunque la página se lea en castellano: *"El idioma no entra en la ruta."* Cada pieza tiene **una sola URL**, compartida por ambos idiomas; el idioma se resuelve aparte (localStorage → navegador), no en la ruta. Por eso `DocumentMeta` no emite `<link rel="alternate" hreflang>`: solo tendrían sentido si cada idioma tuviera su propia URL, y aquí no la tiene.

Los enlaces internos no escriben las rutas a mano: usan helpers de `src/i18n/lang` (`rutaProyecto`, `rutaNota`, `RUTA_INICIO`).

**`/lab`** es un banco de pruebas para el diseño del "pez", no enlazado desde ninguna parte; se llega escribiendo la URL. Va en diferido para no pesar en el bundle inicial y su carpeta `src/lab/` se borra entera cuando se decida.

**`404`**: cualquier ruta no reconocida cae en `*` → `NotFound`, que muestra un `404`, un titular (`t('noExiste')`) y un enlace de vuelta al inicio.

### 2.3 La portada (`src/pages/Home.tsx`)

El orden de la portada, de arriba abajo:

1. **Hero** (`<Hero />`): la foto/cabecera sobre la que flota el header en modo overlay.
2. **Intro**: un `<section>` con la entradilla (`profile.intro`) y una lista de enlaces sociales + el CV. Lleva `-mt-6` a propósito para que la entradilla suba hasta la cola de la máscara del hero y foto y texto se lean como una sola pieza.
3. **Proyectos** (`Section id="proyectos"`): lista de `projects`, cada uno con título, año (`formatYear`) y resumen, enlazando al detalle vía `rutaProyecto(p.slug)`.
4. **Notas** (`Section id="notas"`): lista de `snippets` **ordenados por fecha, la más reciente primero**. El orden se calcula una sola vez a nivel de módulo: `const notasPorFecha = [...snippets].sort((a, b) => b.date.localeCompare(a.date))`. Los borradores (`s.draft`) se pintan atenuados y sin enlace.
5. **Experiencia** (`Section id="experiencia"`): lista compacta de `experience` (rango de años + empresa + rol) y, al final, un enlace **`/about`** con `t('masSobreMi')`.

**El porqué del orden y del reordenamiento**: las notas se leen como un blog (lo reciente arriba), pero **los proyectos NO se reordenan**: su orden en `projects/index.ts` es deliberado (producción antes que herramientas). Es decir, notas = cronológico automático; proyectos = curado a mano.

### 2.4 La página `/about` (`src/pages/About.tsx`)

Orden de `About`: enlace "volver" a `/`; título `h1` con `t('sobreMi')`; **bio** (`profile.bio` traducida, partida en párrafos por dobles saltos de línea); **experiencia detallada** (a diferencia de la portada, aquí cada puesto trae empresa, rol, rango de fechas, un resumen y una lista de `highlights`); **educación** (institución, programa, estado, rango de fechas); **contacto** (los enlaces sociales —el email como texto plano, sin el prefijo `mailto:`— más el enlace de descarga del CV).

### 2.5 Rendimiento (lo sutil vive en `App.tsx`)

El objetivo: que al hacer clic en un proyecto o nota la página aparezca al instante, aunque su código sea pesado.

**Por qué diferir.** Las páginas de detalle arrastran `react-markdown` (~156 kB). Solo `Home` entra en el bundle inicial; `ProjectDetail`, `SnippetDetail` y `About` se cargan en chunks diferidos.

**Por qué `React.lazy` a secas no basta.** Aunque el módulo ya esté descargado, `lazy` suspende al menos un microtick, y en cuanto React 19 muestra un fallback lo mantiene un mínimo de ~300 ms para no parpadear. Medido: skeleton + ~400 ms de espera con el código ya en el navegador.

**La solución: `diferida()`.** Es un envoltorio sobre `lazy` que guarda el componente ya resuelto en una variable de módulo (`let lista`). Expone dos cosas:

- `precargar()`: importa el chunk y guarda el componente en `lista`.
- `Pagina`: un componente que, en el render, mira `lista`. Si ya está cargado, **pinta el componente directamente y de forma síncrona** (`return C ? <C {...props} /> : <Perezosa {...props} />`); solo si aún no está, cae en la versión `lazy` (`Perezosa`) que sí suspende. Así se esquiva por completo el fallback de ~300 ms cuando el código ya está.

**La precarga en segundo plano.** `usePrecarga()`, invocado en `Shell`, llama a `precargar()` de las tres páginas diferidas *cuando el navegador está libre*: usa `requestIdleCallback(precargar, { timeout: 2000 })`. Así, para cuando el usuario hace clic, el chunk ya suele estar descargado y `Pagina` lo pinta directo.

**Trampa (Safari):** Safari no tiene `requestIdleCallback`. Por eso hay un fallback a `setTimeout(precargar, 1000)`. Sin ese fallback, en Safari no se precargaría nada y cada clic pasaría por el `lazy` con su espera.

**`useTransitions={false}` en el `BrowserRouter`.** Por defecto React Router 7 navega dentro de `startTransition`, y en una transición React se queda pintando la **página vieja, sin dar señal**, hasta que llega el código de la nueva (medido: ~1 s en 4G sin precarga). Desactivando la transición, el `<Suspense>` puede mostrar el skeleton en cuanto hay que esperar; y si la página ya estaba precargada, no hay espera. Es decir: `useTransitions={false}` es lo que hace que el skeleton aparezca al instante en vez de dejar la pantalla congelada.

**El skeleton con retraso** (`src/components/PageSkeleton.tsx`). El fallback del `<Suspense>` es `<PageSkeleton />`. La clase `.skeleton` entra con **150 ms de retraso** para no parpadear en cargas rápidas. Con la precarga lo normal es que el contenido llegue antes y el skeleton no se vea nunca; solo aparece cuando la espera es real (red lenta, o clic antes de que termine la precarga). Sus medidas replican las de `ArticleHead` para que al llegar el contenido no salte nada (layout shift cero).

Complementos de navegación, también en `App.tsx`:

- **`ScrollToTop`**: al cambiar de ruta salta al tope con `behavior: 'instant'`. Si la URL trae hash (p. ej. `/#notas` desde otra página), reintenta durante unos frames con `requestAnimationFrame` hasta que la sección monta, y entonces sí hace scroll suave.
- **`DocumentMeta`**: mantiene al día `<html lang>`, `document.title` y la meta `description` según el idioma, y persiste el idioma en `localStorage`. `lang` no es cosmético: decide la voz del lector de pantalla.

### 2.6 Header, Footer, Section

**`Header`** (`src/components/Header.tsx`). Una sola línea: el nombre "Alexander Parco" a la izquierda (enlace a `RUTA_INICIO`) y la navegación a la derecha (`NAV`: `/#proyectos`, `/#notas`, `/about`, más el `LangToggle`). Sin caja ni filete, porque en una columna de 42rem cualquier marco compite con el contenido.

- **Variante `overlay`** (prop booleana, por defecto `false`): en la portada (`overlay={pathname === '/'}`) el header **flota sobre la foto del hero**. Se saca del flujo con `absolute inset-x-0 top-0 z-10` y repite el centrado de la columna; usa tonos "cream" para leerse sobre la foto. Sin `overlay`, es un header normal en el flujo, con tonos "ink".
- Los `NavLink` con ancla (`#`) no se marcan activos: la comprobación `!item.to.includes('#')` evita que los enlaces con hash aparezcan activos por toda la portada.

**`Footer`** (`src/components/Footer.tsx`). Separado con `mt-24` y un filete superior. Contiene el copyright con el año y la ubicación, y la lista de enlaces sociales (externos con `target="_blank"` + `rel="noopener noreferrer"`). Además es la **"portería" del sol** (`Ball.tsx`): tiene `data-ball-goal` y escucha el evento `ball:goal`; si el sol cae ahí, aparece un mensaje premio con email y CV. Es un extra para quien juega, no contenido esencial: el mismo email y CV están en la portada y en `/about`.

**`Section`** (`src/components/Section.tsx`). Un apartado de portada: un `<section>` con `id` (para el scroll por hash) y un rótulo `<h2>` pequeño y discreto (`text-ink-faint`) sobre el contenido. Aporta el espaciado superior (`mt-16`) y `scroll-mt-8` para que el título no quede pegado al borde al saltar por ancla. Lo usan tanto `Home` como `About`.


## 3. La portada: el hero, el sol lanzable y el nombre vivo

La portada es la pieza central: una foto a sangre, un nombre en crema encima y un "sol" que se puede agarrar y lanzar por toda la pantalla hasta que choca con las letras. Nada de esto es adorno suelto: los tres componentes (`Hero`, `Ball`, `HeroName`) se coordinan a través de un registro compartido en `src/lib/sol.ts`, sin estado de React, escribiendo variables CSS 60 veces por segundo.

### 3.1. El hero

El contenedor es un `<section>` que **rompe la columna** con `mx-[calc(50%-50vw)]` (`src/components/Hero.tsx`). En vez de sacar la portada fuera del `<main>`, se queda como una página más dentro del contenedor y estira sus márgenes negativos hasta los bordes del viewport. El comentario del archivo lo explica: así "el shell no necesita saber nada" y la cabecera puede flotar encima sobre el cielo de la foto. Su alto es fluido: `h-[clamp(460px,82vh,820px)]` con `overflow-hidden`.

La foto es `hero.jpg`, cargada desde `import.meta.env.BASE_URL`, a `object-cover object-[center_58%]` para encuadrar hacia abajo del centro, con `fetchPriority="high"` y `decoding="async"` porque es lo primero que se ve.

**La máscara que la disuelve por abajo** vive en `.hero-fade` (`theme.css`): una `mask-image` con `linear-gradient(to bottom, #000 80%, transparent 100%)`. Es decir, la imagen es opaca hasta el 80% de su alto y de ahí al 100% se desvanece a transparente, fundiéndose con el fondo de la página. **Trampa:** por eso el bloque del nombre se coloca dentro del 80% superior (con `pb-[24%]`); si cayera en el tramo disuelto, quedaría sin foto detrás.

**El velo** es `.hero-veil`: dos gradientes verdosos muy oscuros (`oklch(0.12 0.01 155 / …)`), uno bajando desde arriba (para que la navegación en crema se lea sobre el cielo) y otro subiendo desde abajo (para que el nombre en crema tenga contraste sobre la foto). No tiñe el centro de la foto, solo los bordes donde va texto claro.

**El texto encima va en `cream`, no en `ink`**: el color del texto depende de la foto, no del fondo del sitio. Arriba del nombre, en fuente mono, va rol y ubicación.

**El ancla `#sol`** es un `<span>` vacío y `aria-hidden` posicionado sobre el horizonte: `top-[21%] left-[70%]` en móvil, `sm:top-[14%] sm:left-[72%]` en desktop. Ahí descansa el sol antes de que nadie lo toque; `Ball` lo lee por `getElementById('sol')`.

**La entrada** es `.hero-img` con `animation: hero-in 1.2s`: el keyframe `hero-in` va de `opacity:0; scale(1.04)` a opacidad plena sin transformar. Es el fundido con un leve deszoom.

### 3.2. El sol (`src/components/Ball.tsx`)

El sol del paisaje hecho objeto: un círculo con su propio resplandor que se agarra y se lanza. Es un `.ball` (`theme.css`): `position:fixed`, 30px, `border-radius:9999px`, un `radial-gradient` con el foco de luz descentrado (`circle at 36% 34%`) y dos `box-shadow` que son su halo. Empieza `visibility:hidden` y lo mueve JS con `transform` (nunca con `top/left`).

Toda la física corre por refs y **un solo `requestAnimationFrame`, sin estado de React**: re-renderizar un componente 60 veces por segundo no tiene sentido. En `import.meta.env.DEV` expone el estado en `window.__sol` para inspeccionarlo.

Constantes de la física: `R=15` (radio real; el CSS pinta 30px = 2·R), `G=2400` px/s² de gravedad, `E=0.72` de restitución del rebote, `MAX_V=4200` de velocidad máxima.

**Los cuatro estados** (`type Mode`):

- **`docked`**: pegado al ancla `#sol`. Cada frame lee el rect del ancla y se centra en él, así que **se desplaza con el scroll de la página**. Solo se muestra si estás en la home (`pathname === '/'`) y existe el ancla; fuera de la portada se oculta. En este estado lleva `data-docked`, que dispara el latido `ball-glow`.
- **`drag`**: sigue al puntero. Cada `pointermove` reposiciona el sol y guarda muestras `{x,y,t}` (máximo 8) para calcular después la velocidad de lanzamiento.
- **`free`**: física completa. Corre `step(dt)` y luego `touch()`.
- **`rest`**: quieto donde cayó. En el suelo se queda en el viewport aunque cambies de página; sentado sobre un sólido, se queda **pegado a la letra** y se mueve con el scroll (ver 3.2.3).

#### 3.2.1. La física (`step`)

Cada frame: gravedad (`vy += G·paso`), un rozamiento aéreo suave en X (`vx *= 1 - 0.25·paso`) y avance por integración de Euler.

**Subpasos contra el túnel**: a 4000 px/s el sol avanzaría ~70px por frame y atravesaría una letra de un salto. Se parte el frame en `pasos` (hasta 12) para que nunca avance más de `R/2` de golpe, y se hace `chocar()` en cada subpaso. **Trampa:** sin esto la colisión con el nombre sería inútil a alta velocidad.

**Rebote en los cuatro bordes** del viewport: al pasarse, se reubica al borde y se invierte la componente normal multiplicada por `E`. En el suelo hay rozamiento extra en X (`vx *= 0.92`) y, si el rebote vertical es menor a 90 px/s, se anula (`vy = 0`) para que deje de temblar. Rodando por el suelo, rozamiento fuerte (`vx *= 1 - 3·dt`) hasta que baja de 6 px/s y pasa a `rest`.

**El "squash"**: en cada golpe fuerte (|v|>250) se calcula un factor de aplastamiento proporcional a la velocidad (tope 0.32) y su eje. `render` lo aplica como `scale` no uniforme (se aplasta en el eje del impacto y se estira en el otro), y decae cada frame con `squash *= 0.82`.

#### 3.2.2. Lo que "toca" y el gol

`touch()` recorre todos los `[data-ball]` (filas de proyectos, notas, experiencia; se usan en `ArticleNav.tsx` y `Home.tsx`) y comprueba solape círculo-rect. Al tocar uno nuevo lo ilumina con `hit()`: le pone `--kick` en la dirección del golpe y le añade `.ball-hit`, cuyo keyframe da un fogonazo de color de acento y un respingo lateral de 900ms.

**Trampa (`lastHit`):** el respingo mueve la fila unos px, así que el borde entraría y saldría del sol y el toque se redispararía en bucle; por eso hay un `WeakMap` que exige 900ms entre toques del mismo elemento.

**El gol**: la portería es el `[data-ball-goal]`, que es el pie (`Footer.tsx`). Como el sol suele rodar a un lado fuera de la columna, la caja de gol se estira **de borde a borde** del viewport (`new DOMRect(0, r.top, viewport().w, r.height)`). Al entrar por primera vez dispara `window.dispatchEvent(new CustomEvent('ball:goal'))`. El pie escucha ese evento y muestra un mensaje de contacto (email + CV) en un bloque con `aria-live="polite"` para que se anuncie sin navegar hasta él. El propio pie lo describe como "un premio para quien juega, no un contenido".

#### 3.2.3. Colisión con sólidos y quedarse sentado

`chocar()` hace círculo-contra-caja para cada `Solido` publicado: halla el punto de la caja más cercano al centro del sol; si está a menos de `R`, empuja al sol por la normal y refleja la velocidad con `E`, con un pelín de rozamiento en la cara (`vx *= 0.96`). Si el centro cayó dentro de la caja (`d===0`) sale por la cara más próxima. Cuando choca, **le avisa al sólido** con `b.golpe(vx, vy, nx, ny)`. Si la normal apunta claramente hacia arriba (`ny < -0.7`), esa caja queda como `apoyo`.

**Sentarse en una letra**: sobre un apoyo, con rebotes cada vez menores, cuando `vy` y `vx` bajan de umbral pasa a `rest` y guarda `apoyo = { id, dx, dy }` (el punto relativo a la esquina de la caja). En reposo sobre un sólido, cada frame busca ese sólido por `id` y se reposiciona a `b.l+dx, b.t+dy`: **va pegado a la letra y se desplaza con el scroll**. Si la letra ya no existe (cambiaste de página), `apoyo=null` y el sol vuelve a `free`, o sea **se cae**.

#### 3.2.4. Accesibilidad y lanzamiento

El sol es un `<button>` real con `aria-label`/`title`.

- **Teclado:** `onClick` con `detail === 0` (activación por Enter/Espacio, no puntero) lo dispara hacia arriba con dirección aleatoria.
- **`prefers-reduced-motion`**: se puede arrastrar y soltar, pero al soltar va directo a `rest` sin inercia ni rebotes; el `onClick` de teclado también se ignora. En el golpe a las letras, además, se omite el giro (ver 3.3).
- **`touch-action: none`**: solo el sol la lleva, para poder arrastrarlo con el dedo sin que la página haga scroll; el resto sigue scrolleando normal.

**El lanzamiento** (`release`): la velocidad se calcula **solo con las muestras de los últimos 90ms**. **Trampa documentada:** antes usaba la primera muestra del arrastre y el sol salía disparado aunque lo soltaras quieto; ahora, si lo sostuviste inmóvil, no hay muestras recientes y cae sin impulso. Un clic casi sin mover (`moved < 4`) da un saltito, para que se note que se puede jugar.

### 3.3. La colisión con el nombre (`src/components/HeroName.tsx` + `src/lib/sol.ts`)

#### 3.3.1. El registro compartido

`sol.ts` define dos cosas mutables, a propósito fuera de React:

- **`sol`**: `{x, y, vx, vy, visible}`. `Ball` lo escribe cada frame: posición, velocidad derivada de la posición frame a frame, y visibilidad. Lo lee quien quiera reaccionar.
- **`solidos`**: un `Map<string, Solido[]>` agrupado por quien publica (hoy solo `'nombre'`). Cada `Solido` es una caja en coordenadas del viewport (`l,t,r,b`) más un callback `golpe(vx, vy, nx, ny)`. Cada dueño reemplaza su lista cada frame y la borra al desmontarse.

#### 3.3.2. La caja REAL del glifo, medida con canvas

Cada letra publica su caja de glifo medida con `canvas.measureText`, **no** la caja de su `<span>`. El porqué: la caja del `<span>` mide lo mismo para la "A" que para la "e" — incluye todo el hueco sobre las minúsculas (el ascendente de la línea). Chocar contra eso haría que el sol rebotara en aire vacío encima de una "e". `measureText` da `actualBoundingBox*` (cuánto sube y baja el glifo real respecto a la línea base) y `fontBoundingBox*` (para ubicar la línea base dentro de la caja de línea).

**Trampa (por qué `offsetLeft/Top` y no `getBoundingClientRect`):** las medidas se toman con `offsetLeft/offsetTop` relativos al `<h1>`, porque el propio giro de la letra movería un `getBoundingClientRect` y contaminaría lo medido. Luego, en el frame, se suma la posición viewport del `<h1>` y el hundimiento `baja[i]`. Se re-mide con `document.fonts.ready` y con un `ResizeObserver`.

**Trampa (publicar siempre):** los sólidos se publican aunque el nombre esté fuera de pantalla: si el sol está sentado en una letra, tiene que poder seguirla al hacer scroll. Solo el resto del bucle (luz, resortes) se salta cuando no es visible (`IntersectionObserver`).

#### 3.3.3. Hundimiento y giro con resorte

Cuando el sol golpea, `golpe(i)` recibe la velocidad y la normal. `nx,ny` apunta de la letra al sol: si le cae encima (`ny<0`) se hunde. La fuerza es la componente de la velocidad contra la normal. Empuja `vbaja` (hundimiento) y, salvo en reduced-motion, `vel` (giro) según hacia dónde iba el sol.

Cada frame, dos resortes independientes:

- **Hundimiento `--baja`**: resorte rígido (`-260·baja - 16·vbaja`), acotado a `[-8, 10]px`, vuelve rápido.
- **Giro `--rot`**: resorte amortiguado con `K=70`, `C=7`, acotado a `±12°` (`MAX_ROT`).

El CSS los traduce a `transform: translateY(var(--baja)) rotate(var(--rot))` con `transform-origin: 50% 88%`: la letra se hunde e inclina desde su base y regresa.

#### 3.3.4. La luz

Cada letra se calienta según la cercanía del sol: `luz = max(0, 1 - dist/1100) ** 1.4`, con base 0.35 si el sol no es visible. Se publica en `--luz`. `.nombre-letra` mezcla ese valor: el color va del crema/gris verdoso apagado hacia el melocotón cálido (`oklch(0.88 0.095 62)`), y el `text-shadow` es un halo cálido cuyo radio y opacidad crecen con la luz. Lanza el sol lejos y el nombre se apaga.

#### 3.3.5. Dos efectos que se quitaron (decisiones)

- **La sombra proyectada**: había una sombra larga en contra del sol; sobre la foto ensuciaba las letras. Se quitó — el halo de `text-shadow` es solo resplandor, no sombra direccional.
- **El "viento"**: mecía las letras al pasar el puntero y en reposo; distraía. Se quitó. Ahora **el nombre solo se mueve cuando el sol lo golpea.**

#### 3.3.6. Una línea y accesibilidad

El nombre va **siempre en una sola línea**: `whitespace-nowrap` y tamaño calculado `clamp(1.5rem, calc((100vw - 2.5rem)/10.9), 3.5rem)`. El divisor 10.9 sale de que el nombre mide ~10.6 veces su tamaño de letra (medido con Geist), con margen para el balanceo; el techo de 3.5rem es lo que cabe en la columna de 42rem. **Trampa:** el espacio entre palabras va fuera del `inline-block` de cada palabra, porque dentro de un inline-block el espacio final se descarta y las palabras quedarían pegadas.

Accesibilidad: el nombre completo va en un `<span class="sr-only">`, y las letras sueltas son `aria-hidden`. Sin esto, un lector de pantalla leería "A, l, e, x…" letra por letra.


## 4. Contenido, datos e internacionalización

Todo el contenido del sitio vive en TypeScript, no en un CMS ni en archivos markdown sueltos: cada pieza es un objeto tipado, y los tipos son los que hacen cumplir las reglas (traducir siempre los dos idiomas, no publicar un hueco vacío, no arrastrar la prosa al bundle inicial). Esta sección documenta ese modelo tal como está en `src/data/` y `src/i18n/`.

### 4.1. El modelo de datos (`src/data/types.ts`)

Todos los tipos de contenido viven en `src/data/types.ts`. El eje del diseño es la separación **metadato / prosa**, que aparece dos veces (proyectos y notas) por la misma razón de bundle.

**`ProjectMeta` vs `Project`.** `ProjectMeta` es "lo que la portada necesita de un proyecto, y nada más": `slug`, `title` (nombre propio, **no se traduce** — es la identidad del proyecto), `summary` (de tipo `L`, una línea para la fila del listado), `tags`, `image`, `demo`, `repo` y `date` (ISO 8601 `YYYY-MM-DD`). `Project extends ProjectMeta` y añade la prosa larga: `decision`, `diagram` (de tipo `L`) y `body` (markdown, `L`).

La separación no es cosmética, y el comentario del propio archivo lo dice: *"el índice se pinta en el bundle inicial y la ficha de detalle va en un chunk diferido. Con un solo tipo, importar el índice arrastraba los cinco cuerpos completos —en los dos idiomas— a la primera carga"*. Es decir, `Project` existe para que solo el detalle pague el costo de la prosa.

**`SnippetMeta` vs `Snippet`.** El mismo patrón para las notas: `SnippetMeta` lleva `slug`, `title` (de tipo `L` — a diferencia de los proyectos, el título de una nota **sí** se traduce), `summary`, `draft: boolean` y `date`. `Snippet extends SnippetMeta` y añade `content` (markdown, `L`).

**Trampa:** `draft` es un campo explícito, no `content === ''`. El comentario explica por qué: *"el índice no carga los cuerpos: no puede mirar lo que no tiene"*. Como la portada solo ve los metadatos, no puede deducir si una nota tiene cuerpo mirando `content`; necesita el dato dicho aparte.

**`Job` y `Study`.** `Job` (experiencia): `role` (`L`), `company` (nombre propio, no se traduce), `summary` (`L`, "qué era el sistema y a qué escala, en una línea"), `highlights` (`L<string[]>`, máximo tres, cada una una decisión o alcance concreto), `start` (ISO `YYYY-MM`) y `end` (`string | null`, `null` = sigue vigente). `Study`: `institution`, `program` (`L`), `status` (`L`), `start`, `end`.

**`Decision` — el registro de decisión.** Es el tipo que da carácter al sitio. Tres campos, todos `L`: `problem` (la restricción o el dolor concreto que forzó la decisión), `choice` (qué se eligió, en una frase) y `tradeoff` (el precio que se paga). El comentario es explícito: *"El precio que se paga por esa elección. Si esto queda vacío, no era una decisión"*. **El trade-off es obligatorio conceptualmente**: un proyecto sin trade-off no entra al índice.

Nota sobre `diagram` siendo `L` y no un simple `string`: el comentario lo justifica — *"un diagrama con las cajas en español dentro de una página en inglés es la única parte que se quedaría sin traducir, y se nota"*. Los rótulos del diagrama son texto, así que también se traducen.

### 4.2. La separación metadato / prosa (`index.ts` / `full.ts` / `textos.ts`)

Cada colección de contenido (proyectos, notas) se reparte en tres tipos de archivo con roles distintos. Tomando proyectos como ejemplo (`src/data/projects/`):

- **`index.ts`** — lo que pinta la portada. Exporta `projects: (ProjectMeta & { slug: SlugProyecto })[]`, un arreglo con los cinco proyectos y solo sus metadatos + resumen. Orden deliberado: *"Primero lo que está EN PRODUCCIÓN con usuarios reales, después las herramientas open-source"*. Es lo único que carga la portada.
- **`textos.ts`** — los slugs y los tipos que obligan a tener ambos idiomas. Define `SlugProyecto` (unión literal de los cinco slugs), `TextoProyecto` (la prosa: `decision`, `diagram`, `body`, aquí como `string` planos porque cada archivo `es.ts`/`en.ts` es de un solo idioma) y `TextosProyecto = Record<SlugProyecto, TextoProyecto>`. **La clave está en usar `Record` sobre la unión de slugs, no sobre `string`:** *"si se añade un proyecto y se olvida su versión inglesa, el error salta al compilar y no en producción con un hueco en blanco"*.
- **`full.ts`** — cose la prosa de los dos idiomas. Importa `meta` de `./index`, `ES` de `./es` y `EN` de `./en`, y con un `.map` reconstruye cada `Project` completo emparejando por slug: `decision`, `diagram` y `body` pasan a ser `{ es, en }`. Como `TextosProyecto` obliga a que ambos ficheros tengan todos los slugs, *"este `map` no puede producir un hueco vacío en tiempo de ejecución"*. **Importar `full.ts` arrastra los cinco cuerpos en los dos idiomas, por eso solo lo importa la página de detalle** (que ya va en chunk diferido); la portada se queda con `./index`.

Las notas (`src/data/snippets/`) replican exactamente esta estructura: `index.ts` (`SnippetMeta[]`, más recientes primero), `textos.ts` (`SlugNota`, `TextoNota` con solo `content`, `TextosNota`) y `full.ts` (cose `content` de `ES`/`EN`).

**Trampa:** los resúmenes (`summary`) viven a propósito en `index.ts` y NO en la prosa. Si el resumen viviera junto al cuerpo, cargar la portada arrastraría los cinco cuerpos completos en los dos idiomas al bundle inicial. El resumen es lo único de la prosa que la portada necesita, así que se sube al metadato.

Sobre los cuerpos `es.ts`/`en.ts`: es **un archivo por idioma**, no `{ es, en }` intercalado dentro de cada registro. La razón: los cuerpos son de ~600 palabras y alternar idioma cada párrafo hace imposible releer la prosa de corrido, que es justo lo que hay que hacer para escribirla bien.

### 4.3. Internacionalización: el idioma vive en el navegador (`src/i18n/`)

**Decisión central:** el idioma vive en el **navegador** (`localStorage` + idioma del sistema como primera pista), **no en la URL**. Está escrito como decisión con precio en `lang.ts`: una sola URL sirve las dos versiones. Los segmentos de ruta van siempre en inglés, incluso leyendo en castellano: `rutaProyecto = /projects/${slug}`, `rutaNota = /notes/${slug}`. Una pieza tiene una sola URL y esa URL no cambia nunca — es lo que mantiene vivo un enlace compartido pase lo que pase con el idioma.

**Trampa (el trade-off del idioma-en-navegador):** con una sola URL por pieza, **no se puede compartir el enlace de una nota "en inglés"** ni **un buscador puede indexar las dos versiones**. A cambio las URLs quedan limpias y no hay `/en` colgando de todo. El slug tampoco se traduce, precisamente para que un enlace no muera al cambiar de idioma.

**`L<T> = Record<Lang, T>`** (`lang.ts`). Un valor traducido es un `Record` sobre los dos idiomas, no un opcional: *"si a un texto le falta uno, no compila. Es la única garantía que impide publicar un hueco en blanco"*. `Lang = 'es' | 'en'`, `DEFAULT_LANG = 'es'`. La función `normaliza()` recorta `en-US`, `es-419` o basura al código corto y cae a `DEFAULT_LANG` si no existe.

**Dos mecanismos, dos capas:**

- **`react-i18next` para los rótulos de UI** (`i18n/index.ts`, `i18n/ui.ts`). El diccionario `UI` en `ui.ts` se escribe **agrupado por clave** (los dos idiomas juntos), no un archivo por idioma, porque son cadenas de tres palabras y verlas emparejadas deja ver que "Trayectoria" y "Career" no dicen exactamente lo mismo. Lleva `satisfies Record<string, L>`, que obliga a que ningún rótulo se quede sin traducir. Como i18next quiere los recursos agrupados por idioma (lo contrario de como se escriben), `recursos` se **deriva** con `Object.fromEntries` en vez de mantener dos formas a mano. En `index.ts` se tipa i18next contra el diccionario real vía `declare module 'i18next'`, de modo que `t('clave-que-no-existe')` es error de compilación y no una clave en crudo en pantalla. Detección: `order: ['localStorage', 'navigator']` con `lookupLocalStorage: 'lang'` y `caches: ['localStorage']` — la elección explícita manda sobre el idioma del sistema y se recuerda. `load: 'languageOnly'` para que un navegador `en-US` encuentre `en` y no caiga al fallback español.
- **`tr()` para elegir la rama de los datos** (`i18n/useLang.ts`). El hook `useLang()` expone `lang`, `t(clave)` (rótulo de UI por clave, vía i18next), `tr(valor)` (elige `valor[lang]` de un `L<T>`) y `cambiar(destino)`. La distinción es explícita: los rótulos cortos van por i18next; los cuerpos de 600 palabras *"no entran en un JSON de traducciones sin volverse inmanejables, así que se quedan en sus ficheros y aquí solo se escoge cuál"*.

**Detalle fino del conmutador de idioma** (`ui.ts`): las claves `cambiarIdioma` y `verEnIdioma` son las únicas que se leen con el idioma **destino** y no con el actual (el botón anuncia el idioma al que te lleva, con el endónimo — "English" dentro de una página en castellano). El comentario documenta un bug ya corregido: antes los valores se guardaban invertidos y se leían con el idioma actual, la inversión se aplicaba dos veces y el botón anunciaba el idioma en el que ya estabas.

### 4.4. Las páginas de detalle como POST

Proyectos y notas comparten la misma anatomía de "entrada de blog" porque en un sitio tipo blog ambos son entradas. `ProjectDetail.tsx` y `SnippetDetail.tsx` importan de `full.ts`, buscan por `slug` de `useParams`, y si no encuentran renderizan `<NotFound />`.

**Estructura de `ProjectDetail`**:
1. `<ArticleHead>` con kicker `t('proyecto')`, fecha formateada, título, resumen, tags y enlaces (demo/código solo si existen).
2. `<DecisionRecord>` con el registro de decisión.
3. `<Diagram>` solo si `tr(project.diagram)` no está vacío.
4. `<ProjectImage>` solo si hay `image` (maneja `complete` en imágenes cacheadas y oculta la figura si falla la carga).
5. El cuerpo markdown dentro de `<Prose>`.
6. `<ArticleNav>` con `projects[i-1]` (anterior) y `projects[i+1]` (siguiente).

**`SnippetDetail`** es más simple: filtra borradores (`!s.draft`), ordena por fecha descendente, usa `splitNoteTitle` para partir el título por la barra, y monta `ArticleHead` (kicker = tema, o `t('nota')` si no hay), `Prose` y `ArticleNav`. **Trampa de dirección:** en notas *"anterior es la más antigua, siguiente la más nueva: el orden de lectura de un blog"* — por eso `prev` es `publicadas[i+1]` y `next` es `publicadas[i-1]`, invertido respecto al índice del arreglo.

**`ArticleHead`**: enlace "← Volver" a `/`, metadato en una línea (`kicker · <time dateTime={dateISO}>`), `<h1>` con el titular, entradilla (`summary`), y la fila de tags + enlaces (con `↗` y texto `sr-only` "(se abre en una pestaña nueva)"). Los tags/enlaces solo se pintan si hay alguno.

**`DecisionRecord`**: un `<dl>` con tres filas en orden fijo — `problem` → `problema`, `choice` → `decision`, `tradeoff` → `tradeoff`. **El trade-off lleva el acento visual:** `key === 'tradeoff' ? 'text-accent' : 'text-ink'`. El comentario lo justifica: *"es la fila que importa: sin un precio explícito no hubo una decisión, hubo una preferencia"*.

**`Diagram`**: el diagrama es **texto ASCII, no una imagen** — se puede seleccionar, buscar y leer con lector de pantalla, sin costo de descarga ni salto de layout. Es un `<pre>` con `tabIndex={0}`, `role="region"` y `aria-label` traducido, con `overflow-x-auto` (una región con scroll debe ser alcanzable por teclado, o su contenido solo se lee con ratón).

**`ArticleNav`**: anterior/siguiente al pie, tipo blog. Devuelve `null` si no hay ni prev ni next. Cada tarjeta es un `<Link>` con flecha (`← etiqueta` a la izquierda, `etiqueta →` a la derecha).

### 4.5. `Prose`: el mapeo de markdown (`src/components/Prose.tsx`)

`Prose` renderiza markdown con `react-markdown` + `remark-gfm` y un mapa de componentes propio. Puntos de diseño:

- **El `#` baja a `<h2>`.** El post ya cuelga de un único `<h1>` (el titular de `ArticleHead`), así que un `#` del markdown no puede emitir un segundo `<h1>`: se mapea a `<h2>`, igual que `##`. Los `<h2>` reales llevan `id` derivado del texto con `slug()` para poder enlazar con `#ancla`.
- **`code` / `pre` con superficie.** El código inline lleva fondo `bg-surface`; el bloque `<pre>` tiene su propio `overflow-x-auto` para que **el body nunca scrollee en horizontal**, con un reset `[&>code]` que anula la superficie del inline dentro del bloque, y `tabIndex={0}` + `role="region"` + `aria-label`.
- **Tablas con scroll propio y accesibles.** El scroll va en un `<div>` envoltorio con `role="region"`, no sobre la `<table>` misma: un `display:block` sobre la tabla le quitaría su rol de tabla en el árbol de accesibilidad. Los `<th>` llevan `scope="col"`.
- Enlaces externos (`/^https?:/`) reciben `target="_blank"`, `rel="noopener noreferrer"` y texto `sr-only` "(se abre en una pestaña nueva)".

**Optimización:** los mapas de componentes se construyen **una vez por idioma** y se cachean en `CACHE`. Si el objeto de componentes cambiara de identidad en cada render, react-markdown volvería a montar todo el árbol de prosa.

Relacionado — `src/lib/headings.ts`: `slug()` normaliza texto a ancla (minúsculas, quita tildes vía NFD, no-alfanuméricos a `-`). `encabezados()` extrae los `##` **del markdown en crudo, no del DOM renderizado** (así no hay que esperar a que `<Prose>` monte ni sincronizar dos árboles), e ignora los `##` dentro de bloques de código (`# comentario` en un shell es texto, no título). `src/lib/titles.ts` — `splitNoteTitle()` parte "NestJS | @MessagePattern vs @EventPattern" por la primera barra: `topic` (antetítulo) y `rest` (titular), para no repetir el dato.

### 4.6. `format.ts`: fechas con `Intl` en UTC (`src/lib/format.ts`)

Todo el formateo de fechas usa `Intl.DateTimeFormat` con `timeZone: 'UTC'` fijo. Dos decisiones documentadas:

- **UTC obligatorio.** Las fechas son ISO sin hora y se parsean como UTC (`parseISO` usa `Date.UTC`). Formatear en la zona local *"puede retroceder un día, así que todo el formateo se hace en UTC"*.
- **Locales `es-PE` y `en-GB`.** No el idioma a secas: en español se formatea para Perú, "de donde escribe". Y `en-GB` en vez de `en-US` **a propósito**, porque el orden día-mes coincide con el español y evita que la misma página cambie de convención al cambiar de idioma.

Funciones: `formatDate` (largo: "5 de enero de 2023" / "5 January 2023"), `formatShortDate`, `formatRange` (usa `UI.actualidad` para `end === null`), `formatYear`, y `formatYearRange` (solo años, porque en la ficha lateral de trayectoria la columna es estrecha y el mes se partiría en tres líneas — usa `UI.hoy` para el presente).

### 4.7. Perfil y experiencia: la regla de no publicar cifras del empleador

**Regla dura, escrita en dos sitios.** En `experience.ts` y en el tipo `Job` (`types.ts`): de un empleador se nombra empresa, cargo, fechas, dominio del producto y tecnología, pero **no** se publica ninguna cifra suya — clientes, facturación, número de servicios, tamaño de plantilla — ni nada que describa una debilidad de sus sistemas. En los **proyectos propios sí aplica lo contrario**: ahí las cifras son suyas y van con detalle. Se ve en la práctica: la entrada "Proyectos propios" da números concretos (5 couriers, modelo canónico de 11 estados) mientras que las de Somos Ari, Zites y Petroamérica hablan de arquitectura y ownership sin cifras del empleador.

**Experiencia (`experience.ts`).** Orden descendente por fecha de inicio. Datos verificables en el código:
- **Somos Ari figura como puesto ACTUAL:** `end: null`, Full-Stack Developer, `start: '2023-09'`.
- **Hay experiencias en paralelo:** "Proyectos propios" también tiene `end: null` con `start: '2025-09'`, y sus summaries dicen literalmente "En paralelo" / "Freelance, en paralelo" (Zites). Es decir, hay más de un `end: null` simultáneo, a propósito.
- La lista: Proyectos propios (2025-09 → null), Somos Ari (2023-09 → null), Zites (2023-05 → 2023-09), Petroamérica (2023-01 → 2023-09). Educación: Tecsup, "Diseño y Desarrollo de Software", Egresado (2021-03 → 2023-09).

**Perfil (`profile.ts`).** `name`, `cv`, `role`, `location` (todos con la versión traducida donde aplica; el nombre, el handle y el archivo del CV no se traducen). El `intro` del hero **dice "cuatro años"** literalmente ("Cuatro años en desarrollo full-stack desde Lima, Perú…" / "Four years…"). La `bio` es PERFIL, no trayectoria — "dice CÓMO DECIDE", y cada afirmación se apoya en algo verificable del propio sitio (las herramientas que escribió, la elección de texto plano sobre base de datos en mnemo, el registro de decisión de cada ficha). Regla explícita: *"nada de biografía inventada. Si una frase no se puede sostener con un repo o con una decisión documentada, no se escribe"*. La versión inglesa conserva el registro, no la literalidad. `socials`: GitHub, LinkedIn, Email.

### 4.8. Tono de las notas en español

Los cuerpos de las notas en español están escritos en **tono casual, primera persona, coloquial** — como se lo contarías a un colega. Es una regla explícita en el encabezado de `snippets/es.ts`: *"Tono: casual, en primera persona, como se lo contarías a un colega. Frases cortas y pocas negritas. Nada de muletillas de texto generado"*. Se ve en los títulos de sección ("Me cansé de escribir clientes para probar un handler") y en la voz de los índices, donde cada nota abre por el problema que llevó a construir la herramienta, no por la solución: *"una nota que empieza en 'cómo se hace X' es documentación; una que empieza en 'por qué X era un problema' es una decisión"*. Complementa la regla de encuadre: las notas se enmarcan en proyectos propios, nunca en trabajo de empleador. La versión inglesa traduce el registro, no palabra por palabra, para que la prosa no suene a folleto.


## 5. Build y despliegue

El portfolio es un sitio 100% estático: React + Vite compilan a HTML/CSS/JS y nginx los sirve. No hay servidor de aplicación, no hay SSR, no hay base de datos. Todo lo que sigue existe para llevar ese `dist/` desde el repo hasta la raíz de `alexanderparco.com` sin downtime y sin exponer la IP del VPS.

Antes el sitio vivía en GitHub Pages. Eso se retiró: ahora se sirve como estático detrás de nginx en un VPS propio, tras un Traefik compartido, con Cloudflare delante.

### 5.1 El build

El pipeline de build vive en `package.json`:

- `pnpm build` = `tsc -b && vite build`. Primero corre el compilador de TypeScript en modo build (`tsc -b`, con project references); si los tipos no compilan, `vite build` ni siquiera arranca. La salida es el estático en `dist/`.
- `base: '/'` está fijado en `vite.config.ts`. El sitio vive en la **raíz** de `alexanderparco.com`, así que los assets se referencian desde `/`. **Trampa:** si algún día el sitio se sirviera bajo un subdirectorio, esto tiene que cambiar a esa ruta; si no, los `<script>` e imports apuntarían a `/assets/...` cuando en realidad estarían en `/subdir/assets/...` y el sitio cargaría en blanco. El propio `vite.config.ts` lo advierte en un comentario.
- `packageManager: "pnpm@11.13.0"` fija la versión exacta de pnpm. Con corepack habilitado, cualquier máquina (tu laptop, el runner de CI, la imagen Docker) usa esa misma versión sin que nadie la instale a mano. Esto es lo que hace que el build sea reproducible entre entornos.

**El guardián de contenido: `pnpm check`** (`scripts/check-placeholders.mjs`). Es un script que barre recursivamente `src/data/` (los `.ts` de `data/projects/` y `data/snippets/`) y **bloquea el build** (`process.exit(1)`) ante dos cosas:

1. **Texto de relleno.** Busca los marcadores `[CONTEXTO]` y `TODO(alex)`. Los fragmentos de contenido llevan `[CONTEXTO]` donde todavía falta la historia real, y ese marcador **se renderiza en la página**. Sin esta barrera, un deploy distraído lo publicaría tal cual.
2. **Tildes coladas en el inglés.** Nace de un fallo real: una pasada de acentuación sobre el castellano trató los ficheros bilingües como si fueran solo español y metió una tilde dentro de la bio en inglés. No rompe el build, no rompe los tipos, y no se ve hasta que alguien lee la página en inglés. El script revisa solo los valores `en:` de los ficheros bilingües (y `en.ts` entero), y marca cualquier palabra con `áéíóúüñ`. **Trampa:** hay una lista blanca deliberada — `Perú` (nombre propio de producto) y `Español` (el endónimo del conmutador de idioma, que en inglés se muestra correcto) — porque son las dos tildes que SÍ deben sobrevivir en texto inglés.

`pnpm check` es la primera cosa que corre en CI, antes de `pnpm build`.

### 5.2 La imagen Docker (`Dockerfile`)

Build multi-stage.

**Stage de build — `node:22-slim`.** Se usa Debian slim y **no** alpine a propósito: rolldown, lightningcss, tailwind oxide y el compilador nativo de TypeScript 7 llegan como binarios precompilados para **glibc** (`linux-x64-gnu`). Alpine usa musl; ahí pnpm instalaría otras variantes de esos binarios o directamente ninguna, y el build fallaría o se comportaría distinto. Slim da glibc sin el peso de la imagen completa de Debian.

Orden de capas pensado para la caché:

1. `corepack enable` (activa el pnpm que fija `packageManager`).
2. `COPY package.json pnpm-lock.yaml ./` y `pnpm install --frozen-lockfile`. Las deps van **primero y solas**: si solo cambia el código de la app pero no las dependencias, Docker reutiliza esta capa y no reinstala nada. `--frozen-lockfile` obliga a que el lockfile mande — si `package.json` y el lock discrepan, falla en vez de resolver a lo que le parezca.
3. `COPY . .` y `pnpm build` → `dist/`.

**Stage de runtime — `nginx:1.27-alpine`.** Aquí sí alpine: nginx no depende de esos binarios nativos, así que la imagen final es mínima. Copia `nginx.conf` a `/etc/nginx/conf.d/default.conf`, copia el `dist/` del stage de build a `/usr/share/nginx/html`, y `EXPOSE 80`. La imagen final no lleva Node, ni el código fuente, ni `node_modules`: solo nginx y el estático.

`.dockerignore` mantiene el contexto de build limpio: excluye `.git`, `.deploy` (los secretos del deploy), `node_modules`, `dist` y `*.tsbuildinfo`. Que `dist` esté ignorado importa — el `dist/` que se sirve es el que produce el build **dentro** de la imagen, nunca uno que se hubiera colado desde la máquina que dispara el build.

### 5.3 `nginx.conf`

Un solo `server` en el puerto 80. nginx corre **detrás de Traefik**, que termina el TLS; nginx solo ve http interno. Puntos clave:

- **`absolute_redirect off`.** Con TLS terminado en Traefik, nginx ve el request como http. Con redirects relativos, el navegador conserva el `https://` original en vez de que nginx lo mande a un `http://` absoluto.
- **SPA — `location /` con `try_files $uri /index.html`.** Las rutas de React Router (`/projects/…`, `/notes/…`, `/about`) no existen como archivo; las resuelve el router en el navegador. Todo lo que no sea un archivo real cae en `index.html`.
- **`index.html` con `Cache-Control: no-cache`.** `index.html` es lo que apunta a los assets con hash. **Trampa:** si `index.html` se cacheara, un cliente seguiría pidiendo el bundle de una versión anterior tras un deploy. Por eso no se cachea nunca; los assets sí, porque su nombre cambia con cada build.
- **`/assets/` con caché de 1 año inmutable.** Los assets de Vite llevan hash de contenido en el nombre, así que son inmutables: `expires 1y` + `Cache-Control: public, immutable`. Aquí `try_files $uri =404` (no cae en index.html): **Trampa:** devolver `index.html` como si fuera un `.js` daría un error de MIME confuso en el navegador en vez de un 404 claro.
- **Archivos de `public/` con 7 días.** El regex `^/[^/]+\.(jpg|png|svg|ico|pdf|glb)$` cubre `hero.jpg`, el CV, el favicon y el modelo `.glb` del lab. Estos **no** llevan hash, así que `expires 7d` sin `immutable`: si se cambia la foto o el CV, se ve como mucho a los 7 días sin tener que renombrarlos.
- **gzip con `gzip_proxied any`.** **Trampa:** el default de nginx (`gzip_proxied off`) no comprime nada que llegue a través de un proxy, y aquí **todo** llega a través de Traefik. Sin `any`, no se comprimiría absolutamente nada. Comprime text/plain, css, javascript, json y svg.
- **Cabeceras de seguridad** (`Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`). **Trampa importante:** `add_header` **no se hereda** hacia un `location` que declare sus propias cabeceras — nginx reemplaza la lista entera, no la fusiona. Por eso las cuatro cabeceras están **repetidas** en cada `location` (`/`, `/assets/`, y el de `public/`). Si se agregan en el bloque `server` y se olvidan en un `location`, ese `location` sale sin ninguna.

### 5.4 `deploy.yml` y la CLI `deploy`

El despliegue se describe en `deploy.yml`:

- Un solo servicio `web`: `build: .` con `dockerfile: Dockerfile`, `port: 80`, `domain: alexanderparco.com`, `healthcheck: /` (nginx sirve `index.html` → 200) y `startup_timeout: 30`.
- `proxy.ssl: true` con Let's Encrypt (email `alexparco16@gmail.com`).
- El host/puerto/llave del `server` vienen de variables (`${SERVER_HOST}`, `${SERVER_PORT}`, `${SERVER_KEY}`), que se rellenan desde los secretos en CI.

La herramienta es una CLI propia, `github.com/AlexParco/deploy`, inspirada en Kamal pero **sin registro de imágenes**. El flujo de `deploy deploy`, con **cero downtime**, es:

1. `rsync` del código al VPS.
2. **Build en el VPS** (no en el runner; por eso no hace falta registro ni push de imagen). Cada sitio tiene su propia imagen, etiquetada por SHA.
3. Levanta el contenedor nuevo **sin ruta** en Traefik todavía (nadie le manda tráfico aún).
4. **Health check** contra `/`.
5. Recién si pasa el health check, **reescribe la ruta de Traefik** para apuntar al contenedor nuevo.
6. **Retira el anterior.**

El orden (verificar salud → enrutar → retirar el viejo) es lo que garantiza cero downtime: si el contenedor nuevo no arranca sano, el tráfico se queda en el viejo y el deploy falla sin tumbar el sitio.

**www.** La CLI rutea **un** dominio por servicio, así que `www.alexanderparco.com` no lo maneja el servicio; se resuelve con una Redirect Rule / Page Rule de Cloudflare (`www → apex`, 301), igual que en otros proyectos (tracking-peru).

### 5.5 CI (`.github/workflows/deploy.yml`)

Dispara en `push` a `main` (y `workflow_dispatch` manual). `concurrency: deploy-portfolio` con `cancel-in-progress: false` — dos pushes seguidos se serializan en vez de cancelarse, para no dejar un deploy a medias.

Dos jobs:

- **`build`:** checkout, setup-node 22, `corepack enable`, `pnpm install --frozen-lockfile`, luego **`pnpm check`** (el guardián de la §5.1) y **`pnpm build`**. Si el check falla o los tipos no compilan, el deploy no corre.
- **`deploy`** (`needs: build`): clona la CLI `deploy` desde GitHub, la buildea y la enlaza (`npm link`); configura SSH escribiendo `~/.ssh/deploy_key` desde el secret `SSH_PRIVATE_KEY` (con `StrictHostKeyChecking no`); arma `.deploy/secrets` con `SERVER_HOST`, `SERVER_PORT` y `SERVER_KEY=~/.ssh/deploy_key`; y corre `deploy deploy`.

**Secrets del repo:** `SERVER_HOST`, `SERVER_PORT`, `SSH_PRIVATE_KEY`.

### 5.6 Infraestructura: VPS, Traefik compartido y Cloudflare

Estado real verificado tras el despliegue.

**El VPS.** `72.60.25.251`, usuario `deploy`, SSH en el puerto `2359`, Debian 13. El build de la imagen ocurre en esta máquina (§5.4).

**Traefik compartido.** Un único Traefik (`deploy-traefik`) tiene los puertos `80/443` del host y enruta por archivos YAML en `/opt/deploy/.traefik/dynamic/*.yml` — **uno por sitio**. El `certResolver` es Let's Encrypt vía **HTTP-01**.

**Aislamiento ("opción A").** En un solo host, los puertos 80/443 los tiene un solo proceso (Traefik), así que **todo** sitio pasa por él. Pero cada sitio tiene su **propio contenedor, su propia imagen (etiquetada por SHA) y su propio archivo de ruta**. Un deploy o un crash del portfolio **no afecta** a los otros sitios (tracking-peru, shalom, etc.), porque el deploy verifica salud antes de enrutar (§5.4). El **único** punto único de fallo compartido es el proceso Traefik + `acme.json`. Independencia total exigiría otro VPS; es un trade-off consciente de costo contra aislamiento.

**Cloudflare, en dos fases para ocultar la IP.** **Trampa de fondo:** Traefik pide el certificado por HTTP-01, y eso choca con el proxy naranja de Cloudflare — Cloudflare fuerza HTTPS y corta la validación HTTP-01. La secuencia que funciona:

- **Fase 1:** el registro A del apex en nube **GRIS** (DNS only). Con la IP expuesta temporalmente, Let's Encrypt valida por HTTP-01 y **emite el cert**.
- **Fase 2:** una vez emitido, SSL/TLS en modo **Full (strict)**; **"Always Use HTTPS" en OFF**; y recién ahí se pasa el registro A a nube **NARANJA** (proxied).
  - **Trampa:** si "Always Use HTTPS" se enciende, la **renovación** HTTP-01 se rompe a los 90 días (mismo choque de la Fase 1). El redirect http→https no hace falta en Cloudflare porque **ya lo hace Traefik**.
  - `www → apex` con una **Page Rule** (Forwarding URL 301).

**Resultado verificado:** el dominio resuelve a IPs de Cloudflare (la IP del VPS queda oculta), certificado válido, `www` redirige al apex, y http fuerza https.
