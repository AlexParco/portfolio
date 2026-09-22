import type { TextosNota } from './textos'

/** Los cuerpos en ingles. Se traduce el registro, no las palabras. Los bloques de codigo
 *  NO se tocan —son codigo, no prosa—, pero sus comentarios si, porque ahi esta la
 *  explicacion. */
export const EN: TextosNota = {
  'nestjs-message-pattern-vs-event-pattern': {
    content: `## The problem

An HTTP controller in NestJS has Swagger. You open the browser, you see every endpoint, you test them right there, and the contract documents itself.

A microservice over **TCP or gRPC has none of that**.

Patterns are loose strings or objects (\`{ cmd: 'create_order' }\`) scattered across the codebase. There is no page telling you which handlers exist. And to test **a single one** you have to write a whole client: instantiate a \`ClientProxy\`, configure the transport, build the payload by hand, subscribe to the Observable. All that for a call that in HTTP would be one click.

Multiply that by every handler you touch, and by every time you come back to a service you have not opened in weeks: there is no page telling you what it exposes, only the code. That is the whole argument.

That is why I wrote [nestprobe](https://github.com/AlexParco/nestprobe): it discovers handlers on its own, generates their schema from the decorators and the \`.proto\` files, and lets you **run them from the browser**. A Swagger for TCP and gRPC.

But before getting there, you need to be clear about the distinction that causes the most silent bugs.

## The actual difference

\`@MessagePattern\` is **request-response**: the client sends a message and **waits** for a reply. Whatever the handler returns travels back.

\`@EventPattern\` is **fire-and-forget**: the client publishes an event and gets on with its life. **Whatever you return is discarded.** There is no return channel.

\`\`\`ts
@Controller()
export class OrdersController {
  // The client is waiting for the result.
  @MessagePattern({ cmd: 'create_order' })
  create(@Payload() dto: CreateOrderDto) {
    return this.orders.create(dto)   // <- this DOES go back to the client
  }

  // The client is already gone. Nobody will read the return.
  @EventPattern('order_created')
  handleCreated(@Payload() event: OrderCreatedEvent) {
    this.mailer.send(event)          // <- a return here is discarded
  }
}
\`\`\`

On the client side the symmetry is the same: \`send()\` for a pattern, \`emit()\` for an event.

## The gotcha that costs the most

\`send()\` returns a **cold Observable**. If nobody subscribes, **the message never leaves**. You call the method, you see no error, and the other service never receives anything.

\`\`\`ts
// Does absolutely nothing.
this.client.send({ cmd: 'create_order' }, dto)

// Either of these two actually sends.
await firstValueFrom(this.client.send({ cmd: 'create_order' }, dto))
this.client.send({ cmd: 'create_order' }, dto).subscribe()
\`\`\`

It is a bug that breaks nothing: no exception, no log, no stack trace. Nothing simply happens. And with no UI to check whether the handler ever got the call, you can lose hours looking for the failure in the wrong place.`,
  },
  'tmux-many-sessions': {
    content: `## The problem

tmux lets you keep many sessions at once. That is exactly the good part and exactly the part that gets away from you.

When you have eight sessions open — one per project — \`prefix + s\` gives you a list of names. But a name does not tell you **the one thing you need to know right then**: which one is working, which one has finished, and which one is waiting on you.

With agents like Claude Code the problem multiplies, because a session can spend minutes thinking on its own. You end up opening each one by hand just to see where there is something to do.

The symptom is easy to recognise: you open a session, see it is still thinking, leave.
You open the next one. By the fourth you no longer remember which one you came from.

What gets lost there is not inside any session, it is **in the trip between them**, and that
is why going faster does not fix it: seeing the state of all eight at once does.

That is why I wrote [tmux-cc-sessions](https://github.com/AlexParco/tmux-cc-sessions): a popup that detects them on its own (by the \`claude\` process), shows you each one’s state — \`working\`, \`ready\`, \`needs you\` — with a live preview, and lets you jump or send them a message without leaving where you are.

But for that to make sense, you first need the tmux hierarchy clear.

## Session, window, pane

The three levels look interchangeable at first. They are not.

| Level | What for |
|---|---|
| **Session** | A project. It survives closing the terminal. |
| **Window** | A task within the project (server, tests, git). |
| **Pane** | A split of the screen, to watch two things at once. |

The rule that put everything in order for me: **one session per project, one window per task.** Panes only when you genuinely need to look at two things at the same time.

## The minimum you need

\`\`\`bash
tmux new -s api          # create the "api" session
tmux ls                  # list live sessions
tmux attach -t api       # go back in
\`\`\`

Inside, everything starts with the **prefix** (\`ctrl+b\` by default):

| Key | What it does |
|---|---|
| \`prefix + d\` | You leave, but the session **keeps running** |
| \`prefix + c\` | New window |
| \`prefix + ,\` | Rename the window (do it: searching by name changes everything) |
| \`prefix + s\` | Session tree |
| \`prefix + %\` / \`"\` | Split into panes (vertical / horizontal) |

## What really matters: the detach

\`prefix + d\` is tmux’s whole reason to exist. The process **does not die** when you close the terminal or your SSH drops. You come back with \`tmux attach\` and everything is exactly where you left it.

## Jumping fast

Once the list grows, \`prefix + s\` falls short. A popup with \`fzf\` to filter by name is another thing entirely:

\`\`\`tmux
bind-key f display-popup -E "\\
  tmux list-sessions -F '#{session_name}' \\
  | fzf --reverse \\
  | xargs -r tmux switch-client -t"
\`\`\`

\`display-popup\` needs **tmux ≥ 3.2**. This 5-line snippet was the seed of the plugin.`,
  },
  'agent-persistent-memory': {
    content: `## The problem

An agent like Claude Code starts **every session blank**.

The decisions you made, the project’s constraints, the gotchas you found the hard way: all of it dies when you close the session. The next day you explain the same thing again. And if you work from two machines, the context you built on one does not exist on the other.

There are tools that solve this, but almost all of them solve it the same way: **a database**. Your memory ends up inside an opaque binary you cannot open, cannot read, cannot version and cannot fix by hand when it breaks.

That bothered me for two reasons. The first is practical: if I cannot read my own memory in a text editor, I do not control it. The second is ownership: my working context is mine, and it has no reason to pass through anybody’s server.

What pushes you to build something like this is not the session you lose, it is the **second
machine**. While you work on one, re-explaining the context is an annoyance and you put up
with it. The moment there are two, the agent on one knows things the other one does not, the
two versions diverge, and it stops being an annoyance: you do not have one memory, you have
two that do not talk to each other.

## The design decision

In [mnemo](https://github.com/AlexParco/mnemo) memory is **\`.md\` files versioned in git**. Nothing else.

- You can **read** them in any editor.
- You can **fix** them by hand when something goes wrong.
- They come with **history** for free, because it is git.
- They sync **peer-to-peer across your machines** (Syncthing). No server.

The honest comparison: it is like [engram](https://github.com/Gentleman-Programming/engram), but minimal and without a database.

## Tags, not folders

The other decision that matters: a note **does not live in a folder**, it carries tags.

\`\`\`md
---
projects: [ari, portfolio]
type: decision
---

The deploy uses Traefik because we needed automatic SSL without
maintaining certificates by hand.
\`\`\`

That means a note can belong to **several projects at once**, which is what actually happens: one infrastructure decision affects three projects, and filing it in a single folder forces you to duplicate it or to file it wrong.

Loading a project is simply **filtering the notes that include it**.

## The split that makes it shareable

The **engine** — the commands and the installer — lives on GitHub and belongs to everyone. The **store** — your notes — lives only on your machines.

Each person installs the same engine and keeps their own private store. Your context does not mix with anyone else’s, and nothing you write ever goes up to GitHub.`,
  },
  'expo-eas-apk-build': {
    content: `## The problem

You run \`eas build\`, you wait in the queue, you download the file... and you cannot install it on the phone.

EAS produces an **\`.aab\`** (Android App Bundle) by default. An \`.aab\` **is not an installable app**: it is a publishing format handed to Google Play, and it is Play that generates the concrete APKs for each device from it.

So if what you wanted was to hand the build to a tester, put it on a device or send it to someone, the file you just waited for **is no use to you**. And the error does not tell you that: the phone simply refuses to install it.

| | \`.aab\` | \`.apk\` |
|---|---|---|
| Good for | Publishing on Play Store | Installing directly |
| Installs on a phone | No | Yes |
| What EAS builds by default | Yes | No |

## How to ask for an APK

Link the project and authenticate:

\`\`\`bash
npm install --global eas-cli
eas login
eas init --id <project-id>
eas build:configure
\`\`\`

\`build:configure\` generates \`eas.json\`. In there you declare a profile with \`buildType: "apk"\`:

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

And you build **with that profile**:

\`\`\`bash
eas build --profile preview --platform android
\`\`\`

## The traps

**You forget the \`--profile\`.** Without it, EAS uses \`production\`, which still gives you an \`.aab\`. The symptom is identical to the original one, so it is easy to think the config did not apply and start debugging \`eas.json\` when \`eas.json\` was fine.

**The profile is named whatever you want.** \`preview\` is not a magic word: it is just the key you put in the JSON. All that matters is that it matches what you pass to \`--profile\`.

**The signature is not Play’s.** EAS generates its own credentials for the APK. It works for handing out test builds, but it **is not the same signature** Play uses to sign your app in production.

**Building locally.** \`eas build --local\` compiles on your machine and saves you the queue, but it needs the Android SDK installed.`,
  },
}
