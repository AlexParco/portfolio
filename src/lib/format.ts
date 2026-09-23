import type { Lang } from '../i18n/lang'
import { UI } from '../i18n/ui'

// El locale no es el idioma a secas: en espanol se formatea para Peru, que es de donde
// escribe. `en-GB` y no `en-US` porque el orden dia-mes coincide con el espanol y evita
// que la misma pagina cambie de convencion al cambiar de idioma.
const LOCALE: Record<Lang, string> = { es: 'es-PE', en: 'en-GB' }

// Las fechas son ISO sin hora: se parsean como UTC. Formatear en la zona local
// puede retroceder un dia, asi que todo el formateo se hace en UTC.
const fmt = (lang: Lang, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(LOCALE[lang], { ...opts, timeZone: 'UTC' })

const longDate: Record<Lang, Intl.DateTimeFormat> = {
  es: fmt('es', { day: 'numeric', month: 'long', year: 'numeric' }),
  en: fmt('en', { day: 'numeric', month: 'long', year: 'numeric' }),
}

const shortDate: Record<Lang, Intl.DateTimeFormat> = {
  es: fmt('es', { day: 'numeric', month: 'short', year: 'numeric' }),
  en: fmt('en', { day: 'numeric', month: 'short', year: 'numeric' }),
}

const monthYear: Record<Lang, Intl.DateTimeFormat> = {
  es: fmt('es', { month: 'short', year: 'numeric' }),
  en: fmt('en', { month: 'short', year: 'numeric' }),
}

const yearOnly: Record<Lang, Intl.DateTimeFormat> = {
  es: fmt('es', { year: 'numeric' }),
  en: fmt('en', { year: 'numeric' }),
}

/** Acepta "YYYY-MM-DD" y "YYYY-MM". */
function parseISO(iso: string): Date {
  const [year, month, day] = iso.split('-')
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day ?? 1)))
}

/** "2023-01-05" -> "5 de enero de 2023" / "5 January 2023" */
export function formatDate(iso: string, lang: Lang): string {
  return longDate[lang].format(parseISO(iso))
}

/** "2023-01-05" -> "5 ene. 2023" / "5 Jan 2023". Para columnas de fecha estrechas. */
export function formatShortDate(iso: string, lang: Lang): string {
  return shortDate[lang].format(parseISO(iso)).replace(/ de /g, ' ')
}

/** "2023-01", null -> "ene. 2023 — actualidad" / "Jan 2023 — present" */
export function formatRange(start: string, end: string | null, lang: Lang): string {
  const from = monthYear[lang].format(parseISO(start))
  const to = end === null ? UI.actualidad[lang] : monthYear[lang].format(parseISO(end))
  return `${from} — ${to}`
}

/** "2024-03-01" -> "2024" */
export function formatYear(iso: string, lang: Lang): string {
  return yearOnly[lang].format(parseISO(iso))
}

/**
 * "2023-09", "2025-09" -> "2023 — 2025".  "2025-09", null -> "2025 — hoy".
 *
 * Solo anos: en la ficha lateral de trayectoria la columna es estrecha y "set. 2023 — set.
 * 2025" se parte en tres lineas. El mes no aporta nada ahi; quien lo necesite tiene el CV.
 */
export function formatYearRange(start: string, end: string | null, lang: Lang): string {
  const from = start.slice(0, 4)
  const to = end === null ? UI.hoy[lang] : end.slice(0, 4)
  return from === to ? from : `${from} — ${to}`
}
