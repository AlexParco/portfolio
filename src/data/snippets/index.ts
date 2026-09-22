import type { SnippetMeta } from '../types'
import type { SlugNota } from './textos'

/**
 * Los mas recientes primero. Aqui va lo que pinta la portada; los cuerpos viven en
 * `es.ts` y `en.ts` y los cose `full.ts`.
 *
 * Cada nota abre por el problema que llevo a construir la herramienta, no por la solucion.
 * Una nota que empieza en "como se hace X" es documentacion; una que empieza en "por que X
 * era un problema" es una decision, que es lo que este sitio publica.
 *
 * REGLA: las notas se enmarcan en PROYECTOS PROPIOS, nunca en trabajo de empleador. Nada de
 * "en el equipo", "en la plataforma donde trabajaba" ni nombres de empresa. El problema
 * tecnico se cuenta en segunda persona o desde el proyecto propio que salio de el; asi la
 * nota se sostiene sola y no publica de rebote como trabajaba una empresa.
 */
export const snippets: (SnippetMeta & { slug: SlugNota })[] = [
  {
    slug: 'nestjs-message-pattern-vs-event-pattern',
    date: '2026-04-20',
    draft: false,
    title: { es: 'NestJS | @MessagePattern vs @EventPattern', en: 'NestJS | @MessagePattern vs @EventPattern' },
    summary: {
      es: 'Cuando esperas respuesta y cuando no. Y por qué acabé escribiendo nestprobe.',
      en: 'When you expect a reply and when you do not. And why I ended up writing nestprobe.',
    },
  },
  {
    slug: 'tmux-many-sessions',
    date: '2026-07-08',
    draft: false,
    title: { es: 'tmux | trabajar con varias sesiones sin perderte', en: 'tmux | working across many sessions without losing track' },
    summary: {
      es: 'Sesiones, ventanas y paneles. Y por qué acabé escribiendo un plugin para no perder la cuenta.',
      en: 'Sessions, windows and panes. And why I ended up writing a plugin to stop losing count.',
    },
  },
  {
    slug: 'agent-persistent-memory',
    date: '2026-07-09',
    draft: false,
    title: { es: 'Agentes | por qué mi contexto vivía en archivos .md', en: 'Agents | why my context lived in .md files' },
    summary: {
      es: 'Un agente arranca en blanco cada sesión. Como resolví eso sin base de datos ni servidor.',
      en: 'An agent starts blank every session. How I solved that without a database or a server.',
    },
  },
  {
    slug: 'expo-eas-apk-build',
    date: '2023-03-21',
    draft: false,
    title: { es: 'Expo | generar un APK instalable con EAS', en: 'Expo | building an installable APK with EAS' },
    summary: {
      es: 'Por qué EAS te da un .aab que no puedes instalar, y cómo pedirle un .apk.',
      en: 'Why EAS hands you an .aab you cannot install, and how to ask it for an .apk.',
    },
  },
]
