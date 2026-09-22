/** Convierte "El problema" en "el-problema", para usarlo como ancla. */
export function slug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes: "decision" -> "decision"
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Saca los encabezados de nivel 2 del markdown para construir el indice lateral.
 *
 * Se leen del texto en crudo y no del DOM ya renderizado: hacerlo del DOM obligaria a
 * esperar a que `<Prose>` monte y a sincronizar dos arboles. El markdown es la fuente.
 *
 * Se ignoran los `##` que caen dentro de un bloque de codigo — en un fragmento de shell,
 * `# comentario` o `## algo` son texto, no titulos.
 */
export function encabezados(markdown: string): { texto: string; id: string }[] {
  const salida: { texto: string; id: string }[] = []
  let enCodigo = false

  for (const linea of markdown.split('\n')) {
    if (linea.trimStart().startsWith('```')) {
      enCodigo = !enCodigo
      continue
    }
    if (enCodigo) continue

    const m = /^##\s+(.+?)\s*$/.exec(linea)
    if (m) salida.push({ texto: m[1], id: slug(m[1]) })
  }
  return salida
}
