import type { TextosNota } from './textos'

/** Los cuerpos en espanol. Ver la nota de `projects/es.ts` sobre por que van separados.
 *  Titulo y resumen viven en `index.ts`: los pinta el indice, y este modulo solo lo carga
 *  la pagina de detalle. */
export const ES: TextosNota = {
  'nestjs-message-pattern-vs-event-pattern': {
    content: `## El problema

Un controlador HTTP en NestJS tiene Swagger. Entras al navegador, ves todos los endpoints, los pruebas ahí mismo, y el contrato está documentado solo.

Un microservicio por **TCP o gRPC no tiene nada de eso**.

Los patterns son strings u objetos sueltos (\`{ cmd: 'create_order' }\`) repartidos por el código. No hay una página que te diga qué handlers existen. Y para probar **uno solo** tienes que escribirte un cliente entero: instanciar un \`ClientProxy\`, configurar el transporte, construir el payload a mano, suscribirte al Observable. Todo eso para hacer una llamada que en HTTP sería un click.

Multiplica eso por cada handler que tocas, y por cada vez que vuelves a un servicio que no abriste en semanas: no hay una página que te diga qué expone, solo el código. Ese es todo el argumento.

Por eso escribí [nestprobe](https://github.com/AlexParco/nestprobe): descubre los handlers solo, les genera el esquema desde los decoradores y los \`.proto\`, y te deja **ejecutarlos desde el navegador**. Un Swagger para TCP y gRPC.

Pero antes de llegar ahí, hay que tener clara la distinción que más bugs silenciosos causa.

## La diferencia real

\`@MessagePattern\` es **request-response**: el cliente manda un mensaje y **espera** una respuesta. Lo que devuelva el handler viaja de vuelta.

\`@EventPattern\` es **fire-and-forget**: el cliente publica un evento y sigue con su vida. **Lo que devuelvas se descarta.** No hay canal de vuelta.

\`\`\`ts
@Controller()
export class OrdersController {
  // El cliente espera el resultado.
  @MessagePattern({ cmd: 'create_order' })
  create(@Payload() dto: CreateOrderDto) {
    return this.orders.create(dto)   // <- esto SI vuelve al cliente
  }

  // El cliente ya se fue. Nadie va a leer el return.
  @EventPattern('order_created')
  handleCreated(@Payload() event: OrderCreatedEvent) {
    this.mailer.send(event)          // <- un return aqui se descarta
  }
}
\`\`\`

Del lado del cliente la simetría es la misma: \`send()\` para pattern, \`emit()\` para event.

## El gotcha que más cuesta

\`send()\` devuelve un **Observable frío**. Si nadie se suscribe, **el mensaje no sale**. Llamas al método, no ves ningún error, y el otro servicio nunca recibe nada.

\`\`\`ts
// No hace absolutamente nada.
this.client.send({ cmd: 'create_order' }, dto)

// Cualquiera de estas dos si envia.
await firstValueFrom(this.client.send({ cmd: 'create_order' }, dto))
this.client.send({ cmd: 'create_order' }, dto).subscribe()
\`\`\`

Es un bug que no rompe nada: no hay excepción, no hay log, no hay stack trace. Simplemente no pasa nada. Y sin una UI donde ver si el handler recibió la llamada, puedes perder horas buscando el fallo en el sitio equivocado.`,
  },
  'tmux-many-sessions': {
    content: `## El problema

tmux te deja tener muchas sesiones a la vez. Eso es justo lo bueno y justo lo que se te va de las manos.

Cuando tienes ocho sesiones abiertas —una por proyecto—, \`prefix + s\` te da una lista de nombres. Pero un nombre no te dice **lo único que necesitas saber en ese momento**: cuál está trabajando, cuál ya terminó, y cuál te está esperando a ti.

Con agentes como Claude Code el problema se multiplica, porque una sesión puede estar minutos pensando sola. Acabas entrando a cada una a mano solo para ver en cuál hay algo que hacer.

El síntoma es fácil de reconocer: entras a una sesión, ves que sigue pensando, te sales.
Entras a la siguiente. A la cuarta ya no te acuerdas de cuál venías.

Lo que se pierde ahí no está dentro de ninguna sesión, está **en el trayecto entre ellas**, y
por eso no lo arregla ir más rápido: lo arregla ver el estado de las ocho a la vez.

Por eso escribí [tmux-cc-sessions](https://github.com/AlexParco/tmux-cc-sessions): un popup que las detecta solas (por el proceso \`claude\`), te muestra el estado de cada una —\`working\`, \`ready\`, \`needs you\`— con preview en vivo, y te deja saltar o mandarles un mensaje sin salir de donde estás.

Pero para que eso tenga sentido, primero hay que tener clara la jerarquía de tmux.

## Sesión, ventana, panel

Los tres niveles parecen intercambiables al principio. No lo son.

| Nivel | Para que |
|---|---|
| **Sesión** | Un proyecto. Vive aunque cierres el terminal. |
| **Ventana** | Una tarea dentro del proyecto (servidor, tests, git). |
| **Panel** | Una división de la pantalla, para ver dos cosas a la vez. |

La regla que me ordenó todo: **una sesión por proyecto, una ventana por tarea.** Los paneles solo cuando de verdad necesitas mirar dos cosas al mismo tiempo.

## Lo mínimo que necesitas

\`\`\`bash
tmux new -s api          # crea la sesion "api"
tmux ls                  # lista las sesiones vivas
tmux attach -t api       # vuelve a entrar
\`\`\`

Dentro, todo empieza con el **prefix** (por defecto \`ctrl+b\`):

| Tecla | Qué hace |
|---|---|
| \`prefix + d\` | Te sales, pero la sesión **sigue corriendo** |
| \`prefix + c\` | Ventana nueva |
| \`prefix + ,\` | Renombra la ventana (hazlo: buscar por nombre lo cambia todo) |
| \`prefix + s\` | Árbol de sesiones |
| \`prefix + %\` / \`"\` | Divide en paneles (vertical / horizontal) |

## Lo que de verdad importa: el detach

\`prefix + d\` es la razón de ser de tmux. El proceso **no muere** cuando cierras el terminal o se te cae el SSH. Vuelves con \`tmux attach\` y todo sigue exactamente donde lo dejaste.

## Saltar rápido

Cuando la lista crece, \`prefix + s\` se queda corto. Un popup con \`fzf\` para filtrar por nombre ya es otra cosa:

\`\`\`tmux
bind-key f display-popup -E "\\
  tmux list-sessions -F '#{session_name}' \\
  | fzf --reverse \\
  | xargs -r tmux switch-client -t"
\`\`\`

\`display-popup\` necesita **tmux ≥ 3.2**. Este snippet de 5 líneas fue el germen del plugin.`,
  },
  'agent-persistent-memory': {
    content: `## El problema

Un agente como Claude Code empieza **cada sesión en blanco**.

Las decisiones que tomaste, las restricciones del proyecto, los gotchas que descubriste a base de golpes: todo eso se muere cuando cierras la sesión. Al día siguiente vuelves a explicar lo mismo. Y si trabajas desde dos máquinas, el contexto que construiste en una no existe en la otra.

Hay herramientas que resuelven esto, pero casi todas lo hacen igual: **una base de datos**. Tu memoria acaba dentro de un binario opaco que no puedes abrir, ni leer, ni versionar, ni arreglar a mano cuando se rompe.

Eso me molestaba por dos razones. La primera es práctica: si no puedo leer mi propia memoria con un editor de texto, no la controlo. La segunda es de propiedad: mi contexto de trabajo es mío, y no tiene por qué pasar por el servidor de nadie.

Lo que empuja a construir algo así no es la sesión que se pierde, es la **segunda máquina**.
Mientras trabajas en una sola, reexplicar el contexto es una molestia y se aguanta. En cuanto
hay dos, el agente de una sabe cosas que el de la otra ignora, las dos versiones divergen, y
ya no es una molestia: es que no tienes una memoria, tienes dos que no se hablan.

## La decisión de diseño

En [mnemo](https://github.com/AlexParco/mnemo) la memoria son **archivos \`.md\` versionados en git**. Nada más.

- Los puedes **leer** con cualquier editor.
- Los puedes **arreglar** a mano cuando algo sale mal.
- Tienen **historial** gratis, porque es git.
- Se sincronizan **P2P entre tus máquinas** (Syncthing). Sin servidor.

La comparación honesta: es como [engram](https://github.com/Gentleman-Programming/engram), pero minimalista y sin base de datos.

## Etiquetas, no carpetas

La otra decisión que importa: una nota **no vive en una carpeta**, lleva etiquetas.

\`\`\`md
---
projects: [ari, portfolio]
type: decision
---

El deploy usa Traefik porque necesitabamos SSL automatico sin
mantener certificados a mano.
\`\`\`

Eso significa que una nota puede pertenecer a **varios proyectos a la vez**, que es lo que pasa en la vida real: una decisión de infraestructura afecta a tres proyectos, y meterla en una sola carpeta te obliga a duplicarla o a elegir mal.

Cargar un proyecto es simplemente **filtrar las notas que lo incluyen**.

## La separación que lo hace compartible

El **engine** —los comandos y el instalador— vive en GitHub y es de todos. El **store** —tus notas— vive solo en tus máquinas.

Cada persona instala el mismo engine y tiene su propio store privado. Tu contexto no se mezcla con el de nadie, y nada de lo que escribes sube nunca a GitHub.`,
  },
  'expo-eas-apk-build': {
    content: `## El problema

Corres \`eas build\`, esperas la cola, descargas el archivo... y no lo puedes instalar en el teléfono.

EAS produce un **\`.aab\`** (Android App Bundle) por defecto. Un \`.aab\` **no es una app instalable**: es un formato de publicación que se le entrega a Google Play, y es Play quien genera desde el los APK concretos para cada dispositivo.

Así que si lo que querías era pasarle la build a un tester, subirla a un dispositivo o mandársela a alguien, el archivo que acabas de esperar **no te sirve**. Y el error no te dice eso: simplemente el teléfono se niega a instalarlo.

| | \`.aab\` | \`.apk\` |
|---|---|---|
| Sirve para | Publicar en Play Store | Instalar directamente |
| Se instala en un móvil | No | Sí |
| Lo genera EAS por defecto | Sí | No |

## Cómo pedir un APK

Enlaza el proyecto y autentícate:

\`\`\`bash
npm install --global eas-cli
eas login
eas init --id <project-id>
eas build:configure
\`\`\`

\`build:configure\` genera \`eas.json\`. Ahí declaras un perfil con \`buildType: "apk"\`:

\`\`\`json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
\`\`\`

Y buildeas **con ese perfil**:

\`\`\`bash
eas build --profile preview --platform android
\`\`\`

## Los tropiezos

**Te olvidas del \`--profile\`.** Sin él, EAS usa \`production\`, que sigue dando \`.aab\`. El síntoma es idéntico al del principio, así que es fácil pensar que la configuración no se aplicó y ponerte a depurar el \`eas.json\` cuando el \`eas.json\` estaba bien.

**El perfil se llama como tú quieras.** \`preview\` no es una palabra mágica: es solo la clave que pusiste en el JSON. Lo único que importa es que coincida con lo que pasas a \`--profile\`.

**La firma no es la de Play.** EAS genera credenciales propias para el APK. Sirve para repartir builds de prueba, pero **no es la misma firma** con la que Play firma tu app en producción.

**Buildear en local.** \`eas build --local\` compila en tu máquina y te ahorra la cola, pero necesita el SDK de Android instalado.`,
  },
}
