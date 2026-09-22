import type { TextosProyecto } from './textos'

/**
 * Los textos LARGOS en espanol. Un fichero por idioma en vez de `{ es, en }` intercalado
 * dentro de cada registro: los cuerpos son de 600 palabras y alternar idioma cada parrafo
 * hace imposible releer la prosa de corrido, que es justo lo que hay que hacer para
 * escribirla bien. El tipo `TextosProyecto` exige TODOS los slugs, asi que un proyecto no
 * puede quedarse sin traducir sin que deje de compilar.
 *
 * Los resumenes NO estan aqui: viven en `index.ts` porque el indice los necesita, y este
 * modulo solo lo carga la pagina de detalle.
 */
export const ES: TextosProyecto = {
  'tracking-peru': {
    decision: {
      problem: `Cada courier peruano publica su rastreo a su manera, y ninguno publica un contrato estable. Quien integra a cinco escribe cinco clientes, cinco parsers y cinco tablas de estados que no coinciden entre sí: "EN REPARTO", "En ruta", "Salió A ENTREGAR" son el mismo hecho con tres nombres.`,
      choice: `Normalizar hacia un modelo canónico de 11 estados y exponer un único endpoint. El vocabulario de cada courier se traduce en el borde del sistema; hacia afuera solo existe el modelo canónico.`,
      tradeoff: `La traducción pierde matiz: un estado propio de un courier que no encaja en los 11 se colapsa al más cercano y esa información no vuelve. A cambio, quien integra escribe un solo switch en vez de cinco, y cuando un courier renombra sus estados el cambio muere dentro del adaptador sin llegar a ningún cliente.`,
    },
    diagram: `Cliente
  │
  │ GET /v1/tracking/{código}
  ▼
┌──────────────────────────────────────────────┐
│  API Tracking Perú                           │
│                                              │
│  resolver ──▶ ¿de qué courier es el código?  │
│      │                                       │
│      ▼                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ adapter  │  │ adapter  │  │ adapter  │ …  │
│  │ courier1 │  │ courier2 │  │ courier3 │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       └─────────────┼─────────────┘          │
│                     ▼                        │
│        normalizador ──▶ 11 estados canónicos │
└──────────────────────────────────────────────┘
                     │
                     ▼
        Misma forma de respuesta, siempre.

  El vocabulario de cada courier no sale nunca del adaptador.`,
    body: `Integrar el rastreo de un courier peruano ya es trabajo. Integrar cinco es el mismo trabajo cinco veces, y cada uno te devuelve **su propio vocabulario de estados**. \`API Tracking Perú\` pone un contrato REST único por delante de los cinco.

## La decisión de fondo

La alternativa barata era un **passthrough**: recibir el código, preguntarle al courier y devolver su respuesta tal cual, quizá envuelta en un sobre común.

Suena razonable y es una trampa. Un passthrough traslada el problema al cliente: sigue habiendo cinco formas distintas, solo que ahora llegan por la misma URL. El trabajo de reconciliar los estados no desaparece, simplemente lo hace otro, cinco veces, cada uno a su manera y con sus propios bugs.

Así que la decisión fue **normalizar**: definir un modelo canónico de **11 estados** y obligar a cada adaptador a traducir hacia él. Hacia afuera, el vocabulario de los couriers **no existe**.

El precio es real y lo acepté a conciencia: la traducción **pierde matiz**. Si un courier tiene un estado propio que no encaja en los 11, se colapsa al más cercano y ese detalle no llega al cliente.

A cambio gano dos cosas que valen más que el matiz:

- Quien integra escribe **un solo** \`switch\`, no cinco.
- Cuando un courier renombra sus estados —y lo hacen—, el cambio **muere dentro del adaptador**. Ningún cliente se entera, ninguna integración se rompe.

## El catálogo de agencias

La segunda mitad del producto es un catálogo de **1,574 agencias georreferenciadas**, con buscador en vivo. Es la pregunta que viene justo después de "¿dónde está mi paquete?": "¿dónde lo recojo?".

El sitio y la documentación son **Astro, TypeScript y Tailwind CSS**, y el buscador de agencias **consume la propia API en vivo**. No es una demo con datos de mentira: es el mismo endpoint que usaría un cliente. Si la API se cae, el buscador se cae — que es exactamente la señal que quiero tener.`,
  },
  'shalom-api-peru': {
    decision: {
      problem: `La plataforma de origen no tiene API pública y trabaja con sesiones de usuario. Para automatizar sobre ella hay dos malas opciones: guardar las credenciales de cada cliente, o pedirle que las reintroduzca en cada llamada.`,
      choice: `Sesiones de token efímero: las credenciales del cliente final se usan para abrir una sesión, se emite un token de vida corta y las credenciales no se persisten. Hacia afuera, el acceso es multi-tenant por API key.`,
      tradeoff: `Sin credenciales guardadas no hay trabajos de fondo indefinidos: cuando el token caduca, hay que renovarlo con una acción del cliente. A cambio no soy custodio de las credenciales de nadie, y una filtración de mi base de datos no compromete la cuenta de ningún cliente en la plataforma de origen.`,
    },
    diagram: `Cliente (API key)
  │
  ▼
┌────────────────────────────────────────────────┐
│  Shalom API Perú                               │
│                                                │
│  api key ──▶ tenant ──▶ rate limit             │
│      │                                         │
│      ▼                                         │
│  sesión de token efímero ──┐                   │
│      │  (credenciales del  │                   │
│      │   cliente, NO se    │                   │
│      │   persisten)        ▼                   │
│      │              plataforma externa         │
│      ▼                                         │
│  guías · tracking · agencias                   │
│      │                                         │
│      ▼                                         │
│  webhook firmado ──▶ reintento ──▶ idempotente │
└────────────────────────────────────────────────┘
        │                    │
        ▼                    ▼
   dashboard           página de estado
   de clientes            (pública)`,
    body: `Shalom mueve carga por todo el Perú y **no tiene API pública**. \`Shalom API Perú\` pone una API REST por delante: rastreo, catálogo de agencias y **creación de guías reales**, no simuladas.

## La decisión de fondo: no guardar credenciales

Operar sobre una plataforma que solo entiende de sesiones de usuario deja dos caminos evidentes, y los dos son malos.

**Guardar las credenciales del cliente.** Es lo cómodo: permite trabajos de fondo, reintentos automáticos y sincronizaciones nocturnas. Y me convierte en **custodio de las credenciales de otra empresa** en un sistema que no controlo. El día que se filtre mi base de datos, el problema no es mío: es de mis clientes, en su cuenta, con su carga.

**Pedirlas en cada llamada.** Seguro y a la vez inútil: ninguna integración sobrevive a eso.

La decisión fue la tercera vía: **sesiones de token efímero**. Las credenciales del cliente final se usan para **abrir una sesión** y se descartan; lo que vive es un token de vida corta.

El precio es concreto: **no hay automatización indefinida**. Cuando el token caduca, hace falta una acción del cliente para renovarlo. A cambio, mi base de datos no contiene nada que comprometa la cuenta de nadie.

## Webhooks firmados en lugar de polling

Una guía cambia de estado varias veces a lo largo de días. La forma perezosa de enterarse es **polling**: preguntar cada N minutos. Es tráfico regalado, se entera tarde y escala con el número de clientes multiplicado por el número de guías.

La API **empuja** el cambio:

- **Firmados** — el cliente verifica que el evento salió de aquí y no de otro sitio.
- **Con reintentos** — si el endpoint del cliente está caído, el evento no se pierde.
- **Idempotentes** — un reintento no puede duplicar un efecto. Es la mitad que casi siempre falta, y sin ella los reintentos son un bug con buena prensa.

## Operar, no solo construir

La API es **multi-tenant por API key**, con **rate limiting** por tenant y **monitoreo de disponibilidad**. Corre en un VPS con Docker.

Encima hay un **dashboard de clientes** y una **página pública de estado**. Esa página es una decisión, no un adorno: si el servicio se degrada, prefiero que el cliente lo lea en una URL antes que escribírmelo por WhatsApp.`,
  },
  'nestprobe': {
    decision: {
      problem: `Un microservicio por TCP o gRPC no expone su contrato. Los handlers están repartidos por el código y probar uno exige escribirse un cliente entero.`,
      choice: `Servir la UI desde dentro de la propia app y derivar el contrato de las fuentes que ya existen: los decoradores, los .proto y la config de connectMicroservice().`,
      tradeoff: `La herramienta queda acoplada al runtime de NestJS: vive en el proceso y no sirve para otro framework. A cambio no hay configuración duplicada ni documentación que se desincronice, porque no existe una segunda fuente de verdad que mantener.`,
    },
    diagram: `Navegador
    │
    │ HTTP
    ▼
┌──────────────────────────────────────────┐
│  Tu app NestJS                           │
│                                          │
│  /explorer ──▶ UI + GET /explorer/spec   │
│      │                                   │
│      │ descubre                          │
│      ▼                                   │
│  @MessagePattern ───────── TCP ─────────▶│──▶ otro servicio
│  @GrpcMethod     ───────── gRPC ────────▶│──▶ otro servicio
│      ▲                                   │
│      │ esquema                           │
│  @MsProperty · .proto · @ApiProperty     │
└──────────────────────────────────────────┘`,
    body: `Los microservicios de NestJS que hablan por **TCP** o **gRPC** no tienen un Swagger: no hay forma de ver qué handlers existen ni de probarlos sin escribirte un cliente a mano. \`nestprobe\` es esa pieza que falta.

Se monta dentro de tu propia app y sirve una UI en el navegador desde la que puedes descubrir, documentar y **ejecutar** tus handlers \`@MessagePattern\`, \`@EventPattern\` y \`@GrpcMethod\`.

## La decisión de fondo

La alternativa obvia era un **cliente externo**: una app aparte a la que le declaras tus servicios y tus contratos. Es lo que hacen casi todas las herramientas de este tipo.

El problema de esa vía es que crea una **segunda fuente de verdad**. Cada vez que añades un handler o cambias un DTO tienes que acordarte de actualizar la herramienta. Y no te vas a acordar: la documentación se desincroniza del código, siempre.

Así que la decisión fue la contraria: **vivir dentro de la app**. Corriendo en el mismo proceso, la herramienta lee los handlers directamente del contenedor de NestJS, saca los tipos de los decoradores que **ya escribiste**, y toma el host y el puerto de tu \`connectMicroservice()\`. Cero configuración, e imposible que se desincronice.

El precio es real y lo acepté a conciencia: queda **atada a NestJS**. No sirve para un microservicio en Go ni en Java.

## Qué hace

- **Auto-descubrimiento** — encuentra todos los handlers registrados, sin configuración.
- **Try it out** — manda peticiones reales por TCP o gRPC y muestra la respuesta al momento.
- **Esquemas desde los decoradores** — \`@MsProperty()\` genera los esquemas con tipos, descripciones y ejemplos.
- **Esquemas desde \`.proto\`** — los tipos de gRPC se extraen solos de las definiciones.
- **Metadata de gRPC** — envía cabeceras (authorization, trace IDs) junto al payload.
- **Errores legibles** — parsea errores de validación, códigos de estado gRPC y excepciones RPC.
- **Export del contrato** — \`GET /explorer/spec\` devuelve todo en JSON, para CI o herramientas externas.

Si ya usas \`@nestjs/swagger\`, reutiliza la metadata de \`@ApiProperty()\` que ya tengas escrita.`,
  },
  'mnemo': {
    decision: {
      problem: `Un agente arranca en blanco cada sesión, y el contexto que construyes en una máquina no existe en la otra. Las alternativas guardan esa memoria en una base de datos.`,
      choice: `La memoria son archivos .md versionados en git y sincronizados P2P entre tus máquinas. Sin base de datos y sin servidor. Las notas se organizan por etiquetas, no por carpetas.`,
      tradeoff: `Sin base de datos no hay índices ni queries: la búsqueda es grep y no escalaría a decenas de miles de notas. A cambio la memoria es legible con cualquier editor, arreglable a mano, tiene historial gratis y no depende de ningún servicio.`,
    },
    diagram: `  Engine (GitHub, compartible)
      │  slash-commands + instalador
      ▼
┌──────────────┐                     ┌──────────────┐
│  Máquina A   │◀──── Syncthing ────▶│  Máquina B   │
│              │      P2P, cifrado   │              │
│  store/*.md  │      sin servidor   │  store/*.md  │
│  + git       │                     │  + git       │
└──────────────┘                     └──────────────┘

  El store nunca toca GitHub. Es tuyo y solo tuyo.`,
    body: `Un agente como Claude Code empieza **cada sesión en blanco**: las decisiones, las restricciones y los gotchas del proyecto se mueren al cerrar. \`mnemo\` guarda ese contexto como **texto plano** y lo mantiene sincronizado **P2P entre tus máquinas**, sin servidor de por medio.

## La decisión de fondo

Lo estándar aquí es una **base de datos**: rápida, indexable, con búsqueda semántica. Es la opción técnicamente superior en casi todos los ejes.

La descarté por dos razones.

La primera es de **control**: si mi memoria vive en un binario opaco, no la puedo leer con un editor, no la puedo arreglar a mano cuando se corrompe y no la puedo versionar. Dejo de ser dueño de mi propio contexto.

La segunda es de **propiedad**: mi contexto de trabajo no tiene por qué pasar por el servidor de nadie.

Así que la memoria son archivos \`.md\` en git, sincronizados P2P con Syncthing. **El precio es explícito**: sin base de datos no hay índices, la búsqueda es \`grep\`, y esto no escalaría a decenas de miles de notas. Para el volumen real de un dev —cientos, no cientos de miles— ese límite no se toca nunca, y a cambio consigo legibilidad, historial de git y cero dependencia de un servicio.

La comparación honesta: es como [engram](https://github.com/Gentleman-Programming/engram), pero minimalista y sin base de datos.

## Etiquetas, no carpetas

La otra decisión que importa. Una nota **no vive en una carpeta**, lleva etiquetas:

\`\`\`md
---
projects: [ari, portfolio]
type: decision
---

El deploy usa Traefik porque necesitabamos SSL automatico
sin mantener certificados a mano.
\`\`\`

Una nota puede pertenecer a **varios proyectos a la vez**, que es lo que pasa en la vida real: una decisión de infraestructura afecta a tres proyectos, y una jerarquía de carpetas te obliga a duplicarla o a elegir mal. Cargar un proyecto es filtrar las notas que lo incluyen.

## La separación que lo hace compartible

El **engine** —los comandos y el instalador— vive en GitHub y es de todos. El **store** —tus notas— vive solo en tus máquinas. Cada persona instala el mismo engine y tiene su propio store privado; nada de lo que escribes sube nunca a GitHub.`,
  },
  'tmux-cc-sessions': {
    decision: {
      problem: `Con varias sesiones de agente abiertas, el nombre de la sesión no te dice lo único que importa: cuál está trabajando, cuál terminó y cuál te está esperando.`,
      choice: `Descubrir las sesiones inspeccionando el árbol de procesos de tmux, en vez de exigir que el usuario las registre o las nombre con una convención.`,
      tradeoff: `Depende de reconocer el proceso: bajo un wrapper o con otro nombre de binario, la sesión no se ve. A cambio no hay nada que configurar ni ningún estado propio que se pueda desincronizar de la realidad.`,
    },
    diagram: `  tmux server
    │
    ├── ari:1 ──▶ proc: claude ──▶ ● working
    ├── ari:2 ──▶ proc: claude ──▶ ● needs you
    ├── ari:3 ──▶ proc: claude ──▶ ● ready
    └── web:1 ──▶ proc: vim    ──▶ (se ignora)
            │
            │  El estado se infiere del proceso.
            │  No hay registro ni configuración.
            ▼
      popup (fzf) ──▶ switch-client   saltar
                 └──▶ send-keys       mandar mensaje`,
    body: `Cuando tienes varias sesiones de Claude Code corriendo en tmux, pierdes la cuenta de cuál está trabajando, cuál terminó y cuál te está esperando. Este plugin las muestra todas en un popup, con preview en vivo, y te deja saltar entre ellas o mandarles un mensaje sin moverte.

## La decisión de fondo

La vía fácil era pedirle al usuario que **registrara** sus sesiones: un comando para darlas de alta, o una convención de nombres (\`cc-*\`) que el plugin pudiera filtrar.

Eso funciona el primer día y falla el segundo. Cualquier sistema que dependa de que el usuario mantenga un registro **acaba desincronizado de la realidad**: creas una sesión a mano y no aparece; matas otra y sigue en la lista.

La decisión fue **no tener registro**. El plugin infiere el estado del árbol de procesos de tmux: si en el panel corre \`claude\`, es una sesión de agente. La única fuente de verdad es el sistema operativo, que no miente.

El precio: si el binario corre bajo un wrapper o con otro nombre, el plugin no lo ve. Es un fallo de **detección**, no de **sincronización** — y prefiero un falso negativo honesto a una lista que afirma cosas que ya no son ciertas.

\`\`\`
╭─ ✳ claude sessions ─────────────────╮╭──────── preview ─────────╮
│ ❯ ● working    ari:1 order  ✳ Rappi ││                          │
│   ● ready      ari:2 stock  ✳ Kardex││   (contenido en vivo de  │
│   ● needs you  ari:3 diag   ✳ Flows ││    la sesion elegida)    │
├─ 🔍 search ─────────────────────────┤│                          │
│   🔍 ord                            ││                          │
╰─────────────────────────────────────╯╰──────────────────────────╯
\`\`\`

## Instalación

Con [tpm](https://github.com/tmux-plugins/tpm):

\`\`\`tmux
set -g @plugin 'AlexParco/tmux-cc-sessions'
\`\`\`

\`prefix + I\` para instalar, \`prefix + u\` para abrir el popup.

Requiere tmux ≥ 3.2, fzf ≥ 0.53 y el CLI de Claude Code.`,
  },
}
