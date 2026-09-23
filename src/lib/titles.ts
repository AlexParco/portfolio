/**
 * Los titulos de las notas vienen como "NestJS | @MessagePattern vs @EventPattern": el
 * tema va delante de una barra. Se separa para pintar el tema como antetitulo y el resto
 * como titular, sin que el mismo dato salga dos veces.
 */
export function splitNoteTitle(title: string): { topic: string; rest: string } {
  const i = title.indexOf('|')
  if (i === -1) return { topic: '', rest: title }
  return { topic: title.slice(0, i).trim(), rest: title.slice(i + 1).trim() }
}
