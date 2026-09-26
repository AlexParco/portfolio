# syntax=docker/dockerfile:1

# --- build: Vite (SPA estatica) → dist/ ---
# Debian slim y no alpine: rolldown, lightningcss, tailwind oxide y el compilador nativo de
# TypeScript 7 llegan como binarios precompilados para glibc (linux-x64-gnu). En alpine
# (musl) pnpm instalaria otras variantes o ninguna.
FROM node:22-slim AS build
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
WORKDIR /src
RUN corepack enable
# Deps primero, para aprovechar la cache de capas: si solo cambia el codigo, no se
# reinstala nada. La version de pnpm la fija `packageManager` en package.json.
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# --- runtime: nginx sirve el estatico ---
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 80
