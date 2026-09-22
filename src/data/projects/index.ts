import type { ProjectMeta } from '../types'
import type { SlugProyecto } from './textos'

/**
 * Los METADATOS de cada proyecto mas su resumen: todo lo que pinta la portada. La prosa
 * larga —decision, diagrama y cuerpo— vive en `es.ts` y `en.ts` y la cose `full.ts`, que
 * solo carga la pagina de detalle.
 *
 * Primero lo que esta EN PRODUCCION con usuarios reales, despues las herramientas
 * open-source. Quien revisa un perfil lee las dos o tres primeras filas y decide; en ese
 * espacio pesa mas una API publica que alguien usa que una herramienta de desarrollo,
 * por buena que sea. Las herramientas no desaparecen: dejan de ir primero.
 *
 * Cada entrada lleva ademas su registro de decision (en `full.ts`): el problema, que se
 * eligio y —lo que de verdad importa— que precio se acepto a cambio. Un proyecto sin
 * trade-off no entra aqui.
 */
export const projects: (ProjectMeta & { slug: SlugProyecto })[] = [
  {
    slug: 'tracking-peru',
    title: 'API Tracking Perú',
    summary: {
      es: 'Un solo contrato REST para rastrear envíos en los cinco couriers principales del Perú.',
      en: 'One REST contract for tracking shipments across Peru’s five main couriers.',
    },
    tags: ['TypeScript', 'NestJS', 'REST', 'Astro', 'Docker'],
    image: '',
    demo: 'https://tracking-peru.com',
    repo: '',
    date: '2025-10-01',
  },
  {
    slug: 'shalom-api-peru',
    title: 'Shalom API Perú',
    summary: {
      es: 'API REST de tracking, agencias y emisión de guías sobre una plataforma que no expone API.',
      en: 'A REST API for tracking, branches and waybill creation on top of a platform that exposes no API.',
    },
    tags: ['TypeScript', 'NestJS', 'REST', 'Webhooks', 'Docker'],
    image: '',
    demo: 'https://shalom-api-peru.com',
    repo: '',
    date: '2026-01-15',
  },
  {
    slug: 'nestprobe',
    title: 'nestprobe',
    summary: {
      es: 'Como Swagger, pero para microservicios NestJS sobre TCP y gRPC.',
      en: 'Like Swagger, but for NestJS microservices over TCP and gRPC.',
    },
    tags: ['TypeScript', 'NestJS', 'gRPC', 'Node.js'],
    image: '',
    demo: '',
    repo: 'https://github.com/AlexParco/nestprobe',
    date: '2026-04-13',
  },
  {
    slug: 'mnemo',
    title: 'mnemo',
    summary: {
      es: 'Memoria persistente por proyecto para agentes: texto plano, sincronizado P2P, sin servidor.',
      en: 'Per-project persistent memory for agents: plain text, synced peer-to-peer, no server.',
    },
    tags: ['Shell', 'Git', 'P2P', 'Claude Code'],
    image: '',
    demo: '',
    repo: 'https://github.com/AlexParco/mnemo',
    date: '2026-07-09',
  },
  {
    slug: 'tmux-cc-sessions',
    title: 'tmux-cc-sessions',
    summary: {
      es: 'Plugin de tmux para ver y controlar todas tus sesiones de Claude Code desde un popup.',
      en: 'A tmux plugin to see and drive all your Claude Code sessions from one popup.',
    },
    tags: ['Shell', 'tmux', 'fzf'],
    image: '',
    demo: '',
    repo: 'https://github.com/AlexParco/tmux-cc-sessions',
    date: '2026-07-06',
  },
]
