# Road to Freedom

A full-stack stock portfolio tracker that helps retail investors plan their journey to financial independence. Users log trades, build watchlists, and track live P&L against live market data.

Built as a polyglot, container-first system — a Spring Boot domain API, a Next.js App Router frontend, and a Python microservice wrapping Yahoo Finance — orchestrated behind a Caddy reverse proxy.

## Live demo

> Coming Soon

## Features

- **Portfolio tracking** — record buy/sell trades, auto-compute average cost, realized/unrealized P&L, and allocation breakdowns.
- **Watchlists** — save symbols and monitor live quotes without taking a position.
- **Live market data** — price and symbol search powered by `yfinance` + `yahooquery`, fronted by an internal FastAPI service.
- **OAuth2 sign-in** — GitHub and Google via Spring Security; session-based auth with a shared cookie across frontend and API.
- **Admin area** — user and content administration behind an `(admin)` route group.
- **Type-safe contract** — backend DTOs annotated with `@Client` are auto-generated into `frontend/models/backend.ts`, so the TS client tracks the Java source of truth at build time.

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     Browser  (localhost:8080)              │
└────────────────────────┬───────────────────────────────────┘
                         │
                    ┌────▼─────┐
                    │  Caddy   │   reverse proxy + TLS
                    └────┬─────┘
        ┌────────────────┼────────────────────────┐
        │                │                        │
  /  /_next/*     /api/*  /oauth2/*         (internal-only)
        │         /swagger-ui/*                   │
   ┌────▼─────┐   ┌───────▼────────┐       ┌──────▼────────┐
   │ Next.js  │   │  Spring Boot   │──────▶│   FastAPI     │
   │ (React)  │◀──│  domain API    │       │   yfinance    │
   │  :3000   │   │     :8081      │       │    :8000      │
   └──────────┘   └───────┬────────┘       └───────────────┘
                          │
                     ┌────▼─────┐
                     │ Postgres │
                     │  :5432   │
                     └──────────┘
```

- The browser **only ever talks to Caddy on `:8080`**. Caddy routes `/api/*`, `/oauth2/authorization/*`, `/login/oauth2/code/*`, `/swagger-ui/*`, and `/v3/api-docs/*` to the Spring backend; everything else goes to Next.js. This keeps auth cookies same-origin across the whole stack.
- The **Next.js frontend** is a thin presentation + BFF layer. Route groups split UX into `(landing)`, `(platform)` (dashboard / portfolio / watchlist), and `(admin)`. `app/api/stocks/*` are Next.js route handlers used as BFF endpoints; everything else lives in Spring.
- The **Spring backend** owns the domain: users, auth, portfolios, trades, watchlists, and admin. It calls FastAPI over HTTP for market data (`YFINANCE_API_URL`) and never exposes it to the browser.
- The **FastAPI microservice** isolates the Python-only market-data ecosystem (`yfinance`, `yahooquery`, `pandas`) from the JVM, so price-provider churn never leaks into the Java codebase.
- **Type generation** is the glue: a Maven plugin walks classes annotated with `@Client` in the `prepare-package` phase and emits `frontend/models/backend.ts`, which the frontend imports for request/response types. One source of truth, enforced at compile time on both sides.

## Tech stack

**Backend — `backend/`**
- Java 21, Spring Boot 3.4
- Spring Security + OAuth2 client (GitHub, Google)
- Spring Data JPA + QueryDSL, MapStruct for DTO mapping
- PostgreSQL
- Lombok, Bean Validation
- `typescript-generator-maven-plugin` → `frontend/models/backend.ts`

**Frontend — `frontend/`**
- Next.js 15 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4, shadcn/ui primitives
- SWR + axios (`lib/httpClient.ts`)

**Market data — `fastapi/`**
- Python, FastAPI, Uvicorn
- `yfinance`, `yahooquery`, `pandas`

**Infrastructure — `rtf-infra/`**
- Docker Compose (`dev/compose.host.yaml`, `dev/compose.full.yaml`, `prod/compose.yaml`)
- Caddy reverse proxy (per-env `Caddyfile`)
- `docker-release.sh` publishes `cxs001/yfinance-fastapi`, `cxs001/rtf-backend`, `cxs001/rtf-frontend`

## Repository layout

```
road-to-freedom-v2/
├── backend/            Spring Boot API (port 8081)
│   └── src/main/java/com/example/backend/
│       ├── auth/         OAuth2 + session security
│       ├── users/  admin/
│       ├── portfolio/ trade/ watchlist/ stock/
│       ├── config/  common/  util/
├── frontend/           Next.js 15 App Router (port 3000)
│   └── app/
│       ├── (landing)/   public marketing + auth
│       ├── (platform)/  dashboard / portfolio / watchlist / home
│       ├── (admin)/     admin console
│       └── api/stocks/  BFF route handlers
├── fastapi/            Python market-data service (port 8000)
└── rtf-infra/
    ├── dev/            host-mode + full-mode compose stacks
    └── prod/           registry-image deployment stack
```

## Running locally

Two dev workflows live in `rtf-infra/dev/`. Pick **host mode** for fast inner-loop development on a single service, or **full mode** for one-command containerized startup.

### Host mode (recommended)

Only infra runs in Docker. Apps run on the host, so saves are instant and debuggers attach normally.

```bash
cd rtf-infra/dev && cp .env.example .env        # fill secrets once
docker compose -f compose.host.yaml up -d        # postgres + caddy

# in separate terminals:
cd backend  && ./mvnw spring-boot:run            # :8081 (dev profile)
cd frontend && npm install && npm run dev        # :3000
cd fastapi  && uvicorn app.main:app --reload     # :8000
```

Open `http://localhost:8080`. Caddy proxies both apps behind one origin.

### Full mode

```bash
cd rtf-infra/dev && docker compose -f compose.full.yaml up --build
```

Source trees are bind-mounted. `.tsx` and `.py` saves hot-reload automatically. `.java` saves need `docker compose restart backend`.

### Useful URLs

| Service          | URL                                      |
| ---------------- | ---------------------------------------- |
| App (via Caddy)  | `http://localhost:8080`                  |
| Swagger UI       | `http://localhost:8080/swagger-ui`       |
| FastAPI docs     | `http://localhost:8000/docs`             |

## Backend → frontend type generation

The TS types the frontend imports from `frontend/models/backend.ts` are **generated from Java**. The workflow:

1. Annotate any DTO/controller that needs to cross the wire with `com.example.backend.util.Client`.
2. `./mvnw package` runs `typescript-generator-maven-plugin` in the `prepare-package` phase and writes `backend/target/typescript-generator/backend.ts`.
3. From `frontend/`, run `npm run update-types` to regenerate and copy the file into place.
4. The frontend won't typecheck until you regenerate after changing a `@Client` class.

`@Nullable` (jakarta) maps to optional TS properties, so nullability stays honest across the boundary.

## Testing & quality

```bash
# backend
cd backend && ./mvnw test
./mvnw test -Dtest=PortfolioServiceTest#computesAverageCost

# frontend
cd frontend && npm run lint && npm run build
```

## Deployment

Production uses prebuilt registry images:

```bash
# on a build host
cd rtf-infra && ./docker-release.sh              # tags + pushes cxs001/*:1.0.0

# on the deploy host
cd rtf-infra/prod && cp .env.example .env        # fill real secrets
docker compose up -d                             # pulls cxs001/*:1.0.0
```

Spring profiles default to `dev` locally and `prod` inside the backend container image (Swagger is closed in prod).

## Design decisions worth calling out

- **Polyglot by necessity, not fashion.** The market-data ecosystem is Python; the domain is Java. Rather than drag one into the other, each service owns its native ergonomics and they meet over HTTP.
- **Single-origin via Caddy.** Running the browser against `:8080` means OAuth2 cookies, CSRF tokens, and API calls are all same-origin — no CORS gymnastics, no split auth state.
- **Generated contract.** Hand-written TS clients drift. A Maven-driven codegen step means any DTO change surfaces as a TS compile error on the next frontend build.
- **Two-mode dev stack.** Host mode optimises for iteration speed (hot reload, native debuggers). Full mode optimises for onboarding (`docker compose up` and go). Both use the same Caddy routing, so there is one mental model.

## License

TBD.
