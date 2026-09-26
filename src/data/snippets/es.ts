import type { TextosNota } from './textos'

/** Los cuerpos en espanol. Ver la nota de `projects/es.ts` sobre por que van separados.
 *  Titulo y resumen viven en `index.ts`: los pinta el indice, y este modulo solo lo carga
 *  la pagina de detalle.
 *
 *  Tono: casual, en primera persona, como se lo contarias a un colega. Frases cortas y
 *  pocas negritas. Nada de muletillas de texto generado ("ese es todo el argumento", "la
 *  comparacion honesta", "no es X, es Y" en cada parrafo). */
export const ES: TextosNota = {
  'nestjs-message-pattern-vs-event-pattern': {
    content: `## Me cansé de escribir clientes para probar un handler

Con HTTP en NestJS te acostumbras rápido a Swagger. Abres el navegador, ves todos los endpoints, los pruebas ahí mismo y el contrato se documenta solo.

Con un microservicio por TCP o gRPC no tienes nada de eso.

Los patterns son strings u objetos sueltos (\`{ cmd: 'create_order' }\`) regados por el código. No hay ninguna página que te diga qué handlers existen. Y si quieres probar uno, te toca armarte un cliente: instanciar un \`ClientProxy\`, configurar el transporte, armar el payload a mano y suscribirte al Observable. Todo eso para algo que en HTTP es un click.

Ahora hazlo con cada handler que tocas. Y cada vez que vuelves a un servicio que no abres hace semanas, lo mismo: lo único que te dice qué expone es el código.

Por eso terminé escribiendo [nestprobe](https://github.com/AlexParco/nestprobe). Encuentra los handlers solo, saca el esquema de los decoradores y de los \`.proto\`, y te deja ejecutarlos desde el navegador. Básicamente, un Swagger para TCP y gRPC.

Pero antes conviene tener clarísima una diferencia, porque es la que más bugs silenciosos causa.

## MessagePattern vs EventPattern

\`@MessagePattern\` es request-response: el cliente manda un mensaje y se queda esperando la respuesta. Lo que devuelve el handler regresa al cliente.

\`@EventPattern\` es fire-and-forget: el cliente publica el evento y sigue en lo suyo. Lo que devuelvas ahí se pierde, no hay por dónde regresar.

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

En el cliente es igual: \`send()\` para los patterns y \`emit()\` para los eventos.

## Ojo con send()

\`send()\` devuelve un Observable frío. Si nadie se suscribe, el mensaje no sale. Llamas al método, no salta ningún error y el otro servicio nunca se entera.

\`\`\`ts
// No hace absolutamente nada.
this.client.send({ cmd: 'create_order' }, dto)

// Cualquiera de estas dos si envia.
await firstValueFrom(this.client.send({ cmd: 'create_order' }, dto))
this.client.send({ cmd: 'create_order' }, dto).subscribe()
\`\`\`

Lo feo de este bug es que no rompe nada. No hay excepción, no hay log, no hay stack trace: simplemente no pasa nada. Y si no tienes dónde ver si el handler recibió la llamada, te puedes pasar horas buscando el problema donde no está.`,
  },
  'tmux-many-sessions': {
    content: `## Ocho sesiones y ni idea de cuál me necesita

Lo bueno de tmux es que puedes tener un montón de sesiones abiertas. Lo malo es exactamente lo mismo.

Con ocho sesiones, una por proyecto, \`prefix + s\` te muestra una lista de nombres. Pero el nombre no te dice lo que de verdad quieres saber: cuál está trabajando, cuál ya terminó y cuál está esperando que le respondas.

Con agentes como Claude Code es peor, porque una sesión se puede quedar varios minutos pensando sola. Terminas entrando a cada una solo para ver si hay algo que hacer.

Seguro te suena: entras a una, sigue pensando, sales. Entras a la siguiente. Para la cuarta ya no sabes de cuál venías.

El tiempo no se pierde dentro de las sesiones, se pierde saltando entre ellas. Por eso ir más rápido no lo arregla. Lo que lo arregla es ver el estado de todas a la vez.

Así nació [tmux-cc-sessions](https://github.com/AlexParco/tmux-cc-sessions): un popup que detecta las sesiones solo (buscando el proceso \`claude\`), te muestra en qué está cada una (\`working\`, \`ready\`, \`needs you\`) con preview en vivo, y te deja saltar a cualquiera o mandarle un mensaje sin moverte de donde estás.

Antes de eso, vale la pena repasar cómo se organiza tmux.

## Sesión, ventana y panel

Al principio parecen lo mismo. No lo son.

| Nivel | Para qué |
|---|---|
| **Sesión** | Un proyecto. Sigue viva aunque cierres la terminal. |
| **Ventana** | Una tarea dentro del proyecto (servidor, tests, git). |
| **Panel** | Una división de la pantalla, para ver dos cosas a la vez. |

A mí lo que me ordenó todo fue esto: una sesión por proyecto y una ventana por tarea. Los paneles, solo cuando de verdad necesitas ver dos cosas al mismo tiempo.

## Lo básico

\`\`\`bash
tmux new -s api          # crea la sesion "api"
tmux ls                  # lista las sesiones vivas
tmux attach -t api       # vuelve a entrar
\`\`\`

Dentro de tmux todo empieza con el prefix (\`ctrl+b\` por defecto):

| Tecla | Qué hace |
|---|---|
| \`prefix + d\` | Te sales, pero la sesión sigue corriendo |
| \`prefix + c\` | Ventana nueva |
| \`prefix + ,\` | Renombra la ventana (hazlo, buscar por nombre te cambia la vida) |
| \`prefix + s\` | Árbol de sesiones |
| \`prefix + %\` / \`"\` | Divide en paneles (vertical / horizontal) |

## El detach es lo mejor de tmux

\`prefix + d\` es el motivo para usar tmux. Cierras la terminal o se te cae el SSH, y el proceso sigue vivo. Vuelves con \`tmux attach\` y todo está como lo dejaste.

## Saltar rápido entre sesiones

Cuando ya tienes muchas, \`prefix + s\` se queda corto. Con un popup y \`fzf\` para filtrar por nombre es otra historia:

\`\`\`tmux
bind-key f display-popup -E "\\
  tmux list-sessions -F '#{session_name}' \\
  | fzf --reverse \\
  | xargs -r tmux switch-client -t"
\`\`\`

Ojo: \`display-popup\` necesita tmux 3.2 o superior. Estas cinco líneas fueron el inicio del plugin.`,
  },
  'agent-persistent-memory': {
    content: `## Explicarle lo mismo al agente todos los días

Claude Code arranca cada sesión desde cero.

Las decisiones que tomaste, las restricciones del proyecto, esos gotchas que descubriste a la mala: todo se pierde cuando cierras la sesión. Al día siguiente toca explicar lo mismo otra vez. Y si trabajas en dos máquinas, lo que armaste en una no existe en la otra.

Hay herramientas que resuelven esto, pero casi todas lo hacen igual: con una base de datos. Tu memoria termina metida en un binario que no puedes abrir, ni leer, ni versionar, ni arreglar a mano si algo se rompe.

A mí eso no me cuadraba. Primero, si no puedo leer mi propia memoria con un editor, no la controlo. Y segundo, mi contexto de trabajo es mío, no tiene por qué pasar por el servidor de nadie.

Lo que al final me hizo construirlo fue la segunda máquina. Con una sola, repetir el contexto es molesto pero se aguanta. Con dos, cada agente sabe cosas que el otro no, las versiones se van separando y al final no tienes una memoria: tienes dos que no se hablan.

## Archivos de texto y git, nada más

En [mnemo](https://github.com/AlexParco/mnemo) la memoria son archivos \`.md\` versionados con git. Eso es todo.

- Los lees con cualquier editor.
- Los arreglas a mano cuando algo sale mal.
- Tienes historial gratis, porque es git.
- Se sincronizan P2P entre tus máquinas con Syncthing, sin servidor.

Si lo comparas con [engram](https://github.com/Gentleman-Programming/engram), la idea va por ahí, pero más minimalista y sin base de datos.

## Etiquetas en vez de carpetas

La otra decisión importante: una nota no vive en una carpeta, lleva etiquetas.

\`\`\`md
---
projects: [ari, portfolio]
type: decision
---

El deploy usa Traefik porque necesitabamos SSL automatico sin
mantener certificados a mano.
\`\`\`

Así una nota puede ser de varios proyectos a la vez, que es lo que pasa en la vida real. Una decisión de infraestructura afecta a tres proyectos y, si la metes en una sola carpeta, o la duplicas o la dejas donde no va.

Cargar un proyecto es solo filtrar las notas que lo tienen.

## Lo que se comparte y lo que no

El engine (los comandos y el instalador) está en GitHub y lo puede usar cualquiera. El store, o sea tus notas, vive solo en tus máquinas.

Todos instalan el mismo engine y cada uno tiene su store privado. Tu contexto no se mezcla con el de nadie y nada de lo que escribes termina en GitHub.`,
  },
  'expo-eas-apk-build': {
    content: `## Esperé la build y no pude instalarla

Corres \`eas build\`, esperas la cola, descargas el archivo... y el teléfono no lo quiere instalar.

Resulta que EAS genera un \`.aab\` (Android App Bundle) por defecto. Y un \`.aab\` no es una app que puedas instalar: es el formato que le subes a Google Play, y es Play el que después arma los APK para cada dispositivo.

O sea, si querías pasarle la build a un tester o instalarla en tu teléfono, el archivo que acabas de esperar no te sirve. Y nadie te avisa: el teléfono simplemente no lo instala.

| | \`.aab\` | \`.apk\` |
|---|---|---|
| Sirve para | Publicar en Play Store | Instalar directamente |
| Se instala en un móvil | No | Sí |
| Lo genera EAS por defecto | Sí | No |

## Cómo pedirle un APK

Primero enlaza el proyecto e inicia sesión:

\`\`\`bash
npm install --global eas-cli
eas login
eas init --id <project-id>
eas build:configure
\`\`\`

\`build:configure\` te crea un \`eas.json\`. Ahí agregas un perfil con \`buildType: "apk"\`:

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

Y haces la build con ese perfil:

\`\`\`bash
eas build --profile preview --platform android
\`\`\`

## Donde uno se tropieza

**Olvidar el \`--profile\`.** Sin eso, EAS usa \`production\`, que te sigue dando \`.aab\`. Como el síntoma es el mismo del inicio, es fácil pensar que la config no se aplicó y ponerte a revisar el \`eas.json\` cuando estaba bien.

**El nombre del perfil lo eliges tú.** \`preview\` no tiene nada de especial, es solo la clave que pusiste en el JSON. Lo único que importa es que coincida con lo que pasas en \`--profile\`.

**La firma no es la de Play.** EAS crea sus propias credenciales para el APK. Te sirven para repartir builds de prueba, pero no es la misma firma con la que Play firma tu app en producción.

**Compilar en local.** \`eas build --local\` hace la build en tu máquina y te ahorras la cola, pero necesitas tener instalado el SDK de Android.`,
  },
}
