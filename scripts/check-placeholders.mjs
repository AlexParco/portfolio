// Impide publicar texto de relleno. Los fragmentos llevan marcas [CONTEXTO] donde falta
// la historia real; sin esta barrera, un `pnpm deploy` distraido las publicaria tal cual.
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const DATA_DIR = new URL('../src/data/', import.meta.url).pathname
const MARKERS = ['[CONTEXTO]', 'TODO(alex)']

const offenders = []

// Recursivo: desde que cada idioma tiene su fichero, la prosa vive en `data/projects/` y
// `data/snippets/`, no sueltos en `data/`. Un barrido plano dejaria de mirar exactamente
// los ficheros que esta barrera existe para vigilar, y lo haria en silencio.
function scan(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      scan(full)
      continue
    }
    if (!entry.name.endsWith('.ts')) continue

    const rel = `src/data/${relative(DATA_DIR, full)}`
    readFileSync(full, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        for (const marker of MARKERS) {
          if (line.includes(marker)) offenders.push(`  ${rel}:${i + 1}  ${marker}`)
        }
      })
  }
}

scan(DATA_DIR)

// ── Segunda barrera: tildes que se cuelan en el texto ingles ─────────────────
//
// Nace de un fallo real: una pasada de acentuacion sobre el castellano trato los
// ficheros bilingues como si fueran solo espanoles y convirtio "decision" en
// "decision" con tilde DENTRO de la bio inglesa. No rompe el build, no rompe los
// tipos y no se ve hasta que alguien lee la pagina en ingles.
//
// Lista blanca: los nombres propios de producto ("API Tracking Peru" con tilde) y el
// endonimo "Espanol" del conmutador de idioma, que en la version inglesa es correcto.
const BLANCA = ['Perú', 'Español']
const ACENTO = /[áéíóúüñÁÉÍÓÚÜÑ]/

function revisaIngles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      revisaIngles(full)
      continue
    }
    if (!entry.name.endsWith('.ts')) continue

    const src = readFileSync(full, 'utf8')
    const rel = `src/data/${relative(DATA_DIR, full)}`

    // en.ts es ingles de arriba abajo. En los ficheros bilingues solo se miran los
    // valores `en:`, y se sustituye lo demas por espacios para no perder el numero
    // de linea: un aviso sin linea obliga a buscar a mano en 300 lineas.
    let objetivo
    if (entry.name === 'en.ts') {
      objetivo = src
    } else {
      objetivo = ' '.repeat(src.length).split('')
      for (const m of src.matchAll(/\ben:\s*(`(?:[^`\\]|\\.)*`|'(?:[^'\\]|\\.)*')/gs)) {
        for (let i = 0; i < m[1].length; i++) objetivo[m.index + m[0].length - m[1].length + i] = m[1][i]
      }
      objetivo = objetivo.join('')
      for (let i = 0; i < src.length; i++) if (src[i] === '\n') objetivo = objetivo.slice(0, i) + '\n' + objetivo.slice(i + 1)
    }

    objetivo.split('\n').forEach((linea, i) => {
      for (const palabra of linea.split(/\s+/)) {
        const limpia = palabra.replace(/[`'".,:;()*—\\]/g, '')
        if (ACENTO.test(limpia) && !BLANCA.includes(limpia)) {
          offenders.push(`  ${rel}:${i + 1}  «${limpia}» lleva tilde en texto ingles`)
        }
      }
    })
  }
}

revisaIngles(DATA_DIR)

if (offenders.length > 0) {
  console.error(
    `\n✗ ${offenders.length} problema(s) de contenido:\n\n${offenders.join('\n')}\n\n` +
      `  Las marcas [CONTEXTO] se RENDERIZAN en la pagina: no pueden llegar a produccion.\n` +
      `  Una tilde en texto ingles suele ser una correccion de castellano aplicada de mas.\n` +
      `  Corrigelo y vuelve a buildear.\n`,
  )
  process.exit(1)
}
