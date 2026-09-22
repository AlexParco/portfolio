import type { TextosProyecto } from './textos'

/**
 * Los textos largos en ingles. No es una traduccion literal del espanol: se traduce el
 * REGISTRO. El original esta escrito en primera persona, seco y sin adjetivos de venta, y
 * eso es lo que tiene que sobrevivir al cambio de idioma — una traduccion palabra por
 * palabra suena a folleto y deja de sonar a la persona que escribio el original.
 */
export const EN: TextosProyecto = {
  'tracking-peru': {
    decision: {
      problem: `Every Peruvian courier publishes its tracking in its own way, and none of them publishes a stable contract. Integrating five means writing five clients, five parsers and five status tables that do not line up: "EN REPARTO", "En ruta" and "SALIO A ENTREGAR" are the same fact under three names.`,
      choice: `Normalise into a canonical model of 11 states and expose a single endpoint. Each courier’s vocabulary is translated at the edge of the system; on the outside, only the canonical model exists.`,
      tradeoff: `Translation loses nuance: a courier-specific state that does not fit the 11 collapses into the nearest one, and that information never comes back. In exchange, whoever integrates writes one switch instead of five, and when a courier renames its states the change dies inside the adapter without reaching any client.`,
    },
    diagram: `Client
  │
  │ GET /v1/tracking/{code}
  ▼
┌──────────────────────────────────────────────┐
│  API Tracking Perú                           │
│                                              │
│  resolver ──▶ which courier owns this code?  │
│      │                                       │
│      ▼                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ adapter  │  │ adapter  │  │ adapter  │ …  │
│  │ courier1 │  │ courier2 │  │ courier3 │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       └─────────────┼─────────────┘          │
│                     ▼                        │
│        normaliser ──▶ 11 canonical states    │
└──────────────────────────────────────────────┘
                     │
                     ▼
         Same response shape, always.

  A courier’s vocabulary never leaves its adapter.`,
    body: `Integrating one Peruvian courier’s tracking is already work. Integrating five is the same work five times, and each one hands you **its own vocabulary of states**. \`API Tracking Perú\` puts a single REST contract in front of all five.

## The decision underneath

The cheap alternative was a **passthrough**: take the code, ask the courier, return its response as-is, maybe wrapped in a common envelope.

It sounds reasonable and it is a trap. A passthrough moves the problem to the client: there are still five different shapes, they just arrive through the same URL now. The work of reconciling states does not disappear — someone else does it, five times, each in their own way and with their own bugs.

So the decision was to **normalise**: define a canonical model of **11 states** and force every adapter to translate into it. On the outside, courier vocabulary **does not exist**.

The price is real and I took it knowingly: translation **loses nuance**. If a courier has a state of its own that does not fit the 11, it collapses into the nearest one and that detail never reaches the client.

In exchange I get two things worth more than the nuance:

- Whoever integrates writes **one** \`switch\`, not five.
- When a courier renames its states — and they do — the change **dies inside the adapter**. No client finds out, no integration breaks.

## The branch catalogue

The second half of the product is a catalogue of **1,574 geolocated branches**, with live search. It is the question that comes right after "where is my parcel?": "where do I pick it up?".

The site and the docs are **Astro, TypeScript and Tailwind CSS**, and the branch search **consumes the API itself, live**. It is not a demo with fake data: it is the same endpoint a client would call. If the API goes down, the search goes down — which is exactly the signal I want to have.`,
  },
  'shalom-api-peru': {
    decision: {
      problem: `The source platform has no public API and works on user sessions. Automating on top of it leaves two bad options: store every client’s credentials, or ask them to re-enter them on every call.`,
      choice: `Short-lived token sessions: the end client’s credentials are used to open a session, a short-lived token is issued, and the credentials are never persisted. On the outside, access is multi-tenant by API key.`,
      tradeoff: `With no stored credentials there are no open-ended background jobs: when the token expires, renewing it takes an action from the client. In exchange I am nobody’s credential custodian, and a breach of my database compromises no client’s account on the source platform.`,
    },
    diagram: `Client (API key)
  │
  ▼
┌────────────────────────────────────────────────┐
│  Shalom API Perú                               │
│                                                │
│  api key ──▶ tenant ──▶ rate limit             │
│      │                                         │
│      ▼                                         │
│  short-lived token session ┐                   │
│      │  (client credentials│                   │
│      │   are NEVER         │                   │
│      │   persisted)        ▼                   │
│      │              external platform          │
│      ▼                                         │
│  waybills · tracking · branches                │
│      │                                         │
│      ▼                                         │
│  signed webhook ──▶ retry ──▶ idempotent       │
└────────────────────────────────────────────────┘
        │                    │
        ▼                    ▼
    client              status page
   dashboard              (public)`,
    body: `Shalom moves freight across Peru and **has no public API**. \`Shalom API Perú\` puts a REST API in front of it: tracking, a branch catalogue and **real waybill creation**, not simulated.

## The decision underneath: do not store credentials

Operating on a platform that only understands user sessions leaves two obvious paths, and both are bad.

**Store the client’s credentials.** That is the comfortable one: it allows background jobs, automatic retries and nightly syncs. It also makes me the **custodian of another company’s credentials** in a system I do not control. The day my database leaks, the problem is not mine — it is my clients’, in their account, with their freight.

**Ask for them on every call.** Safe and useless at the same time: no integration survives that.

The decision was the third path: **short-lived token sessions**. The end client’s credentials are used to **open a session** and then discarded; what lives on is a short-lived token.

The price is concrete: **there is no open-ended automation**. When the token expires, renewing it takes an action from the client. In exchange, my database holds nothing that could compromise anyone’s account.

## Signed webhooks instead of polling

A waybill changes state several times over days. The lazy way to find out is **polling**: asking every N minutes. It is traffic given away for free, it finds out late, and it scales with the number of clients times the number of waybills.

The API **pushes** the change instead:

- **Signed** — the client can verify the event came from here and not from somewhere else.
- **With retries** — if the client’s endpoint is down, the event is not lost.
- **Idempotent** — a retry cannot duplicate an effect. This is the half that is almost always missing, and without it retries are a bug with good PR.

## Operating it, not just building it

The API is **multi-tenant by API key**, with per-tenant **rate limiting** and **uptime monitoring**. It runs on a VPS with Docker.

On top of that there is a **client dashboard** and a **public status page**. That page is a decision, not decoration: if the service degrades, I would rather the client read it on a URL than write it to me on WhatsApp.`,
  },
  'nestprobe': {
    decision: {
      problem: `A microservice speaking TCP or gRPC exposes no contract. Its handlers are scattered across the codebase, and testing one means writing a whole client by hand.`,
      choice: `Serve the UI from inside the app itself and derive the contract from sources that already exist: the decorators, the .proto files and the connectMicroservice() config.`,
      tradeoff: `The tool stays coupled to the NestJS runtime: it lives in the process and is useless for any other framework. In exchange there is no duplicated configuration and no documentation that can drift, because there is no second source of truth to maintain.`,
    },
    diagram: `Browser
    │
    │ HTTP
    ▼
┌──────────────────────────────────────────┐
│  Your NestJS app                         │
│                                          │
│  /explorer ──▶ UI + GET /explorer/spec   │
│      │                                   │
│      │ discovers                         │
│      ▼                                   │
│  @MessagePattern ───────── TCP ─────────▶│──▶ another service
│  @GrpcMethod     ───────── gRPC ────────▶│──▶ another service
│      ▲                                   │
│      │ schema                            │
│  @MsProperty · .proto · @ApiProperty     │
└──────────────────────────────────────────┘`,
    body: `NestJS microservices that speak **TCP** or **gRPC** have no Swagger: there is no way to see which handlers exist, or to test one, without writing a client by hand. \`nestprobe\` is that missing piece.

It mounts inside your own app and serves a browser UI where you can discover, document and **run** your \`@MessagePattern\`, \`@EventPattern\` and \`@GrpcMethod\` handlers.

## The decision underneath

The obvious alternative was an **external client**: a separate app you declare your services and contracts to. That is what almost every tool in this space does.

The problem with that path is that it creates a **second source of truth**. Every time you add a handler or change a DTO you have to remember to update the tool. And you will not remember: documentation drifts from code, always.

So the decision went the other way: **live inside the app**. Running in the same process, the tool reads handlers straight out of the NestJS container, pulls types from the decorators you **already wrote**, and takes host and port from your \`connectMicroservice()\`. Zero configuration, and drift is impossible.

The price is real and I took it knowingly: it is **tied to NestJS**. It is no use for a microservice in Go or Java.

## What it does

- **Auto-discovery** — finds every registered handler, no configuration.
- **Try it out** — sends real requests over TCP or gRPC and shows the response immediately.
- **Schemas from decorators** — \`@MsProperty()\` generates schemas with types, descriptions and examples.
- **Schemas from \`.proto\`** — gRPC types are extracted from the definitions on their own.
- **gRPC metadata** — send headers (authorization, trace IDs) alongside the payload.
- **Readable errors** — parses validation errors, gRPC status codes and RPC exceptions.
- **Contract export** — \`GET /explorer/spec\` returns everything as JSON, for CI or external tooling.

If you already use \`@nestjs/swagger\`, it reuses the \`@ApiProperty()\` metadata you have already written.`,
  },
  'mnemo': {
    decision: {
      problem: `An agent starts blank every session, and the context you build on one machine does not exist on the other. The alternatives keep that memory in a database.`,
      choice: `Memory is .md files versioned in git and synced peer-to-peer between your machines. No database, no server. Notes are organised by tags, not by folders.`,
      tradeoff: `With no database there are no indexes and no queries: search is grep, and it would not scale to tens of thousands of notes. In exchange the memory is readable in any editor, fixable by hand, comes with history for free, and depends on no service.`,
    },
    diagram: `  Engine (GitHub, shareable)
      │  slash-commands + installer
      ▼
┌──────────────┐                     ┌──────────────┐
│  Machine A   │◀──── Syncthing ────▶│  Machine B   │
│              │      P2P, encrypted │              │
│  store/*.md  │      no server      │  store/*.md  │
│  + git       │                     │  + git       │
└──────────────┘                     └──────────────┘

  The store never touches GitHub. It is yours and only yours.`,
    body: `An agent like Claude Code starts **every session blank**: a project’s decisions, constraints and gotchas die when you close it. \`mnemo\` keeps that context as **plain text** and keeps it synced **peer-to-peer across your machines**, with no server in between.

## The decision underneath

The standard answer here is a **database**: fast, indexable, semantic search. It is the technically superior option on almost every axis.

I ruled it out for two reasons.

The first is **control**: if my memory lives inside an opaque binary, I cannot read it in an editor, I cannot fix it by hand when it corrupts, and I cannot version it. I stop owning my own context.

The second is **ownership**: my working context has no reason to pass through anybody’s server.

So memory is \`.md\` files in git, synced peer-to-peer with Syncthing. **The price is explicit**: with no database there are no indexes, search is \`grep\`, and this would not scale to tens of thousands of notes. At a developer’s real volume — hundreds, not hundreds of thousands — that ceiling is never touched, and in exchange I get readability, git history and zero dependency on a service.

The honest comparison: it is like [engram](https://github.com/Gentleman-Programming/engram), but minimal and without a database.

## Tags, not folders

The other decision that matters. A note **does not live in a folder**, it carries tags:

\`\`\`md
---
projects: [ari, portfolio]
type: decision
---

The deploy uses Traefik because we needed automatic SSL
without maintaining certificates by hand.
\`\`\`

A note can belong to **several projects at once**, which is what actually happens: one infrastructure decision affects three projects, and a folder hierarchy forces you to duplicate it or to file it wrong. Loading a project means filtering the notes that include it.

## The split that makes it shareable

The **engine** — the commands and the installer — lives on GitHub and belongs to everyone. The **store** — your notes — lives only on your machines. Each person installs the same engine and keeps their own private store; nothing you write ever goes up to GitHub.`,
  },
  'tmux-cc-sessions': {
    decision: {
      problem: `With several agent sessions open, the session name does not tell you the one thing that matters: which is working, which has finished and which is waiting on you.`,
      choice: `Discover sessions by inspecting the tmux process tree, instead of requiring the user to register them or name them by convention.`,
      tradeoff: `It depends on recognising the process: under a wrapper, or with a different binary name, the session is invisible. In exchange there is nothing to configure and no state of its own that can drift out of sync with reality.`,
    },
    diagram: `  tmux server
    │
    ├── ari:1 ──▶ proc: claude ──▶ ● working
    ├── ari:2 ──▶ proc: claude ──▶ ● needs you
    ├── ari:3 ──▶ proc: claude ──▶ ● ready
    └── web:1 ──▶ proc: vim    ──▶ (ignored)
            │
            │  State is inferred from the process.
            │  No registry, no configuration.
            ▼
      popup (fzf) ──▶ switch-client   jump to it
                 └──▶ send-keys       send a message`,
    body: `When you have several Claude Code sessions running in tmux, you lose track of which one is working, which has finished and which is waiting on you. This plugin shows them all in a popup, with a live preview, and lets you jump between them or send them a message without moving.

## The decision underneath

The easy path was to ask the user to **register** their sessions: a command to add them, or a naming convention (\`cc-*\`) the plugin could filter on.

That works on day one and fails on day two. Any system that relies on the user maintaining a registry **ends up out of sync with reality**: you create a session by hand and it does not show up; you kill another and it is still on the list.

The decision was to **have no registry**. The plugin infers state from the tmux process tree: if \`claude\` is running in the pane, it is an agent session. The only source of truth is the operating system, which does not lie.

The price: if the binary runs under a wrapper or with a different name, the plugin does not see it. That is a **detection** failure, not a **sync** failure — and I prefer an honest false negative to a list that asserts things that stopped being true.

\`\`\`
╭─ ✳ claude sessions ─────────────────╮╭──────── preview ─────────╮
│ ❯ ● working    ari:1 order  ✳ Rappi ││                          │
│   ● ready      ari:2 stock  ✳ Kardex││   (live contents of the  │
│   ● needs you  ari:3 diag   ✳ Flows ││    selected session)     │
├─ 🔍 search ─────────────────────────┤│                          │
│   🔍 ord                            ││                          │
╰─────────────────────────────────────╯╰──────────────────────────╯
\`\`\`

## Installation

With [tpm](https://github.com/tmux-plugins/tpm):

\`\`\`tmux
set -g @plugin 'AlexParco/tmux-cc-sessions'
\`\`\`

\`prefix + I\` to install, \`prefix + u\` to open the popup.

Requires tmux ≥ 3.2, fzf ≥ 0.53 and the Claude Code CLI.`,
  },
}
