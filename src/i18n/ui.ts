import type { L, Lang } from './lang'
import { LANGS } from './lang'

/**
 * Los rotulos de la interfaz.
 *
 * La fuente se escribe agrupada POR CLAVE —los dos idiomas juntos— y no un fichero por
 * idioma: son cadenas de tres palabras, y verlas emparejadas es lo que deja ver que
 * "Trayectoria" y "Career" no dicen exactamente lo mismo. Los cuerpos largos van al reves,
 * un fichero por idioma, porque ahi lo que hace falta es leer la prosa de corrido.
 *
 * `satisfies Record<string, L>` obliga a que ningun rotulo se quede sin traducir: si falta
 * un idioma, no compila. i18next por si solo no da esa garantia — cae al `fallbackLng` y
 * publica el texto en el idioma equivocado sin decir nada.
 */
export const UI = {
  indice: { es: 'Índice', en: 'Index' },
  perfil: { es: 'Perfil', en: 'Profile' },
  trayectoria: { es: 'Trayectoria', en: 'Career' },
  periodo: { es: 'Periodo', en: 'Period' },
  piezas: { es: 'piezas', en: 'pieces' },
  proyectos: { es: 'proyectos', en: 'projects' },
  notas: { es: 'notas', en: 'notes' },
  proyecto: { es: 'Proyecto', en: 'Project' },
  nota: { es: 'Nota', en: 'Note' },
  borrador: { es: 'borrador', en: 'draft' },
  tipo: { es: 'Tipo', en: 'Type' },
  fecha: { es: 'Fecha', en: 'Date' },
  stack: { es: 'Stack', en: 'Stack' },
  tema: { es: 'Tema', en: 'Topic' },
  enlaces: { es: 'Enlaces', en: 'Links' },
  codigo: { es: 'código', en: 'code' },
  demo: { es: 'demo', en: 'demo' },
  decision: { es: 'Decisión', en: 'Decision' },
  problema: { es: 'Problema', en: 'Problem' },
  tradeoff: { es: 'Trade-off', en: 'Trade-off' },
  sistema: { es: 'Sistema', en: 'System' },
  captura: { es: 'Captura', en: 'Screenshot' },
  sobre: { es: 'Sobre', en: 'About' },
  apartados: { es: 'Apartados', en: 'Sections' },
  volver: { es: '← volver al índice', en: '← back to index' },
  descargarCV: { es: 'descargar CV', en: 'download CV' },
  contacto: { es: 'Contacto', en: 'Contact' },
  emision: { es: 'Emisión', en: 'Issued' },
  noExiste: { es: 'No existe esa ruta.', en: 'That route does not exist.' },
  inicio: { es: '← inicio', en: '← home' },
  // Estas dos claves son las UNICAS que se leen con el idioma DESTINO y no con el actual:
  // el conmutador habla del idioma al que te lleva. Cada valor es el nombre del idioma en
  // su propia lengua —el endonimo—, que es la convencion: "English" dentro de una pagina en
  // castellano solo puede significar "pasar al ingles".
  //
  // Ojo: antes esto guardaba los valores YA invertidos y se leia con el idioma ACTUAL. Al
  // pasar a leerlos con el destino, la inversion se aplicaba dos veces y el boton anunciaba
  // el idioma en el que ya estabas. Cada idioma va en su casilla y la inversion la hace UNA
  // sola vez quien lee, que es donde se ve.
  cambiarIdioma: { es: 'Español', en: 'English' },
  // El nombre accesible va completo: un control que solo se anuncia como "English" no dice
  // si cambia esta pagina o te lleva a otra.
  verEnIdioma: {
    es: 'Ver esta página en español',
    en: 'View this page in English',
  },
  temaClaro: { es: '[ claro ]', en: '[ light ]' },
  temaOscuro: { es: '[ oscuro ]', en: '[ dark ]' },
  aClaro: { es: 'Cambiar a modo claro', en: 'Switch to light mode' },
  aOscuro: { es: 'Cambiar a modo oscuro', en: 'Switch to dark mode' },
  saltar: { es: 'Saltar al contenido', en: 'Skip to content' },
  navPrincipal: { es: 'Principal', en: 'Main' },
  nuevaPestana: { es: '(se abre en una pestaña nueva)', en: '(opens in a new tab)' },
  inicioAria: { es: 'Inicio', en: 'Home' },
  diagramaArquitectura: { es: 'Diagrama de la arquitectura', en: 'Architecture diagram' },
  bloqueCodigo: { es: 'Bloque de código', en: 'Code block' },
  tabla: { es: 'Tabla', en: 'Table' },
  actualidad: { es: 'actualidad', en: 'present' },
  hoy: { es: 'hoy', en: 'today' },
  pdfNuevaPestana: { es: '(PDF, se abre en una pestaña nueva)', en: '(PDF, opens in a new tab)' },
} satisfies Record<string, L>

export type ClaveUI = keyof typeof UI

/**
 * i18next quiere los recursos agrupados por idioma, que es justo lo contrario de como se
 * escriben. Se derivan aqui en vez de mantener las dos formas a mano: dos fuentes de verdad
 * para lo mismo se desincronizan a la primera.
 */
export const recursos = Object.fromEntries(
  LANGS.map((lang) => [
    lang,
    Object.fromEntries(Object.entries(UI).map(([clave, valor]) => [clave, valor[lang]])),
  ]),
) as Record<Lang, Record<ClaveUI, string>>
