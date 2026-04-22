# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

Three deployable services plus infra glue:

- `backend/` — Spring Boot 3.4 / Java 21 API (port `8081`). Domain modules live under `src/main/java/com/example/backend/` (`auth`, `users`, `admin`, `portfolio`, `watchlist`, `trade`, `stock`, `pushNotifications`, `email`, `s3`, `config`, `common`, `util`). Persistence is JPA + QueryDSL against PostgreSQL; MapStruct handles DTO mapping; JobRunr runs background jobs (dashboard on `8001`); OAuth2 (GitHub/Google) + Spring Security for auth; web-push (VAPID) for browser notifications; AWS SDK S3 for uploads; Thymeleaf for email templates.
- `frontend/` — Next.js 15 (App Router, Turbopack) / React 19 / TypeScript / Tailwind v4 (port `3000`). Route groups split UX: `app/(landing)`, `app/(platform)` (dashboard/portfolio/watchlist/home), `app/(admin)`, plus `app/api/stocks` for BFF routes. Shadcn-style primitives in `components/ui/`, feature components at `components/` root. `lib/httpClient.ts` is the axios wrapper; `lib/backend/` and `lib/auth/` are the backend client layers; `models/backend.ts` is **generated** (see type-generation flow below).
- `fastapi/` — Python microservice wrapping `yfinance` + `yahooquery` for stock prices and symbol search (port `8000`). Routes in `app/routes.py`. Spring backend calls it via `YFINANCE_API_URL`.
- `rtf-infra/` — Compose stacks split by environment. `dev/` has two modes: `compose.host.yaml` (postgres + mailpit + caddy only — backend/frontend/yfinance run on the host for fast inner loop) and `compose.full.yaml` (everything containerized with bind-mounted source for hot reload). `prod/compose.yaml` pulls registry images (`cxs001/*:1.0.0`) and is the official deployment path. Each env directory has its own `Caddyfile*` and `.env.example`. `docker-release.sh` tags `yfinance-fastapi`, `rtf-backend`, `rtf-frontend` under namespace `cxs001` and pushes.

## Running locally

Two dev workflows live under `rtf-infra/dev/`. Pick host mode for fast iteration on a single service; pick full mode for one-command containerized startup.

**Host mode (recommended for active development)** — only infra runs in compose; you run the apps on the host so saves are instant:
```bash
cd rtf-infra/dev && cp .env.example .env   # fill in secrets once
docker compose -f compose.host.yaml up -d   # postgres + mailpit + caddy

cd backend  && ./mvnw spring-boot:run       # picks up dev profile by default
cd frontend && npm install && npm run dev
cd fastapi  && uvicorn app.main:app --reload
```
Caddy at `http://localhost:8080` proxies to the host processes via `host.docker.internal`. JobRunr dashboard at `http://localhost:8001`, mailpit UI at `http://localhost:8025`, swagger at `http://localhost:8080/swagger-ui`.

**Full mode (everything in containers, hot reload via bind mounts)**:
```bash
cd rtf-infra/dev && docker compose -f compose.full.yaml up --build
```
Source trees are bind-mounted: `.tsx` and `.py` saves trigger Next.js / uvicorn reload automatically. `.java` saves require `docker compose restart backend` (no `spring-boot-devtools` is configured). Heavier on RAM than host mode.

**Spring profiles**: `application.properties` defaults `spring.profiles.active=dev`, so bare `./mvnw spring-boot:run` lands in dev (JobRunr dashboard + Swagger on). `backend/Dockerfile` sets `SPRING_PROFILES_ACTIVE=prod`, so containers built from it default to prod (diagnostic surface closed). Override per-environment in compose if needed.

**Standalone commands** — from `backend/`:
```bash
./mvnw clean package            # build jar + trigger TS generation
./mvnw test                     # run all tests
./mvnw test -Dtest=ClassName#method  # single test
```

From `frontend/`:
```bash
npm run build
npm run lint
npm run update-types            # regenerate + copy backend.ts (see below)
```

**Prod stack** — from `rtf-infra/prod/`:
```bash
cp .env.example .env             # fill real secrets on the deploy host (do not commit)
docker compose up -d             # pulls cxs001/*:1.0.0 images
```
Build + publish images first via `cd rtf-infra && ./docker-release.sh` (edits `DOCKER_NAMESPACE`/`TARGET_TAG` inside; expects `yfinance-fastapi:latest`, `rtf-backend:latest`, `rtf-frontend:latest` to exist locally — build them with `docker build` in each service directory before releasing).

## Backend → Frontend type generation (important)

This is the contract between the Java backend and the TypeScript frontend and it is not obvious from the code:

1. The Maven `typescript-generator-maven-plugin` runs in the `prepare-package` phase and scans for classes annotated with `com.example.backend.util.Client`. **Only `@Client`-annotated classes appear in the generated output** — if a new DTO/controller needs to cross the wire, annotate it.
2. Output is written to `frontend/models/backend.ts` as an implementation module with a Spring application client (axios-compatible). `@Nullable` (jakarta) maps to optional TS properties.
3. `npm run generate-types` from `frontend/` invokes `mvnw.cmd compile` then `mvnw.cmd typescript-generator:generate` in `backend/` (Windows-specific wrapper). `npm run update-types` additionally copies from `backend/target/typescript-generator/backend.ts` via `copy-types`. On non-Windows you'll need to adapt the wrapper call.
4. After changing any `@Client` class or any DTO it references, regenerate before the frontend will typecheck.

## Routing in the integrated stack

The browser always hits `http://localhost:8080` (Caddy). Caddy forwards `/api/*`, `/oauth2/authorization/*`, `/login/oauth2/code/*`, `/swagger-ui/*`, and `/v3/api-docs/*` to the backend on `:8081`; everything else goes to the Next.js frontend on `:3000`. OAuth callback paths **must** stay on this list — if you add a new OAuth provider or auth endpoint, update every Caddyfile (`rtf-infra/dev/Caddyfile.host`, `rtf-infra/dev/Caddyfile.full`, `rtf-infra/prod/Caddyfile`). The host-mode Caddyfile uses `host.docker.internal`; full and prod use bridge service names (`backend:8081`, `frontend:3000`).

## Conventions worth knowing

- Ports in use: frontend `3000`, fastapi `8000`, JobRunr dashboard `8001`, backend `8081`, mailpit UI `8025` / SMTP `1025`, postgres `5432`, caddy `8080`.
- Mailpit is the dev SMTP sink — open `http://localhost:8025` to inspect outgoing mail.
- Lombok is in use in the backend; the Spring Boot Maven plugin is configured to exclude it from the repackaged jar.
- Frontend uses shadcn/ui conventions (`components.json`, primitives under `components/ui/`). Data fetching is SWR + axios via `lib/httpClient.ts`; prefer adding to `lib/backend/` over ad-hoc fetches.
- `backend/Notes.md` and `frontend/notes.md` are author scratch notes — not authoritative.
