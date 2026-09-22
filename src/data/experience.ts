import type { Job, Study } from './types'

// Descendente por fecha de inicio.
//
// REGLA DURA sobre lo que se publica de un empleador: se nombra la empresa, el cargo, las
// fechas, el dominio del producto y la tecnologia. NO se publica ninguna cifra suya —
// clientes, facturacion, numero de servicios, tamano de plantilla— ni nada que describa una
// debilidad de sus sistemas. Eso es informacion de la empresa, no del que trabajo ahi.
//
// En los proyectos PROPIOS no aplica: ahi las cifras son suyas y van con detalle.
export const experience: Job[] = [
  {
    role: { es: 'Backend · diseño y operación', en: 'Backend · design and operations' },
    company: 'Proyectos propios',
    summary: {
      es: 'Dos APIs REST públicas de logística para el mercado peruano, diseñadas y operadas de extremo a extremo.',
      en: 'Two public REST logistics APIs for the Peruvian market, designed and operated end to end.',
    },
    highlights: {
      es: [
        'API Tracking Perú: un solo contrato REST sobre 5 couriers, normalizando cinco vocabularios de estados a un modelo canónico de 11.',
        'Shalom API Perú: tracking, agencias y creación de guías reales sobre una plataforma externa, con sesiones de token efímero por cliente.',
        'Multi-tenant por API key, rate limiting, webhooks firmados con reintentos e idempotencia. Todo en VPS con Docker, y monitoreo de disponibilidad propio.',
      ],
      en: [
        'API Tracking Perú: a single REST contract over 5 couriers, normalising five different status vocabularies into one canonical model of 11.',
        'Shalom API Perú: tracking, branch lookup and real waybill creation on top of an external platform, using short-lived token sessions per client.',
        'Multi-tenant by API key, rate limiting, signed webhooks with retries and idempotency. All on a VPS with Docker, plus my own uptime monitoring.',
      ],
    },
    start: '2025-09',
    end: null,
  },
  {
    role: { es: 'Desarrollador Full-Stack', en: 'Full-Stack Developer' },
    company: 'Somos Ari',
    summary: {
      es: 'Plataforma SaaS multi-tenant de facturación electrónica, ventas y catálogo.',
      en: 'Multi-tenant SaaS platform for e-invoicing, sales and catalogue.',
    },
    highlights: {
      es: [
        'Backend en TypeScript y NestJS sobre una arquitectura de microservicios, con ownership directo sobre diseño, despliegue y estabilidad.',
        'Aislamiento de datos y de procesos por cliente en un entorno multi-tenant en producción.',
        'Comunicación asíncrona con Apache Kafka para orquestar los flujos entre servicios: alta de productos, ventas y emisión de comprobantes.',
      ],
      en: [
        'Backend in TypeScript and NestJS on a microservices architecture, with direct ownership of design, deployment and stability.',
        'Per-client data and process isolation in a multi-tenant production environment.',
        'Asynchronous communication with Apache Kafka to orchestrate flows across services: product creation, sales and invoice issuing.',
      ],
    },
    start: '2023-09',
    end: '2025-09',
  },
  {
    role: { es: 'Desarrollador Frontend', en: 'Frontend Developer' },
    company: 'Zites',
    summary: {
      es: 'Freelance, en paralelo. Aplicación web bajo Atomic Design.',
      en: 'Freelance, in parallel. Web application built on Atomic Design.',
    },
    highlights: {
      es: [
        'Lideré el frontend en React y TypeScript, estructurando la librería de componentes reutilizables y el estado con Redux.',
      ],
      en: [
        'Led the frontend in React and TypeScript, structuring the reusable component library and state management with Redux.',
      ],
    },
    start: '2023-05',
    end: '2023-09',
  },
  {
    role: { es: 'Desarrollador Full-Stack', en: 'Full-Stack Developer' },
    company: 'Petroamérica',
    summary: {
      es: 'Intranet corporativa, app móvil y el sistema de facturación.',
      en: 'Corporate intranet, mobile app and the invoicing system.',
    },
    highlights: {
      es: [
        'Lideré la migración a una versión mayor de Java del sistema de facturación, un servicio crítico y de alto volumen, coordinando la puesta en producción.',
        'Intranet en React y automatización de procesos en la aplicación móvil con React Native.',
      ],
      en: [
        'Led the major-version Java migration of the invoicing system, a critical high-volume service, coordinating the production rollout.',
        'Intranet in React and process automation in the mobile app with React Native.',
      ],
    },
    start: '2023-01',
    end: '2023-09',
  },
]

export const education: Study[] = [
  {
    institution: 'Tecsup',
    program: {
      es: 'Diseño y Desarrollo de Software',
      en: 'Software Design and Development',
    },
    status: { es: 'Egresado', en: 'Graduate' },
    start: '2021-03',
    end: '2023-09',
  },
]
