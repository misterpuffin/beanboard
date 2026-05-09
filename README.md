# beanboard

Self-hosted practice management dashboard for small professional service firms. Replaces the chaos of Excel-based scheduling with a clean, structured UI.

## Quick start

```bash
# Prerequisites: Node.js >= 20, pnpm
pnpm install
pnpm dev
```

The app runs at `http://localhost:5173` with in-memory seed data — no database required.

### With Supabase (optional)

To run with a local Supabase instance:

```bash
pnpm exec supabase start     # starts local Postgres, Auth, REST, Studio
pnpm exec supabase db reset   # applies migrations + seed data
pnpm dev
```

Supabase Studio is available at `http://localhost:54323`.

## What's in the box

Four views, all navigable from the top tabs:

- **Pipeline** — Kanban board of all projects by status
- **Deadlines** — Table sorted by upcoming deadlines, overdue items highlighted
- **Schedule** — Weekly grid (placeholder, coming later)
- **Workload** — Bar chart of active projects per team member

Seed data includes 15 clients, 12 team members, and 18 projects spread across all statuses.

## Dev commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Type-check and build for production |
| `pnpm lint` | Run ESLint |
| `make db-reset` | Reset local Supabase DB (migrations + seed) |
| `make db-types` | Regenerate TypeScript types from local DB |
| `make db-start` | Start local Supabase |
| `make db-stop` | Stop local Supabase |

## Schema changes

1. `pnpm exec supabase migration new <name>` — creates a new migration file
2. Write SQL in `supabase/migrations/<timestamp>_<name>.sql`
3. `make db-reset` — drops and recreates the local DB
4. `make db-types` — regenerates `src/lib/database.types.ts`
5. Update `src/lib/types.ts`, `src/data/seed.ts`, and `supabase/seed.sql` as needed

Never edit an existing migration — always create a new one.

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React + Vite + TypeScript |
| UI | shadcn/ui (base-nova) + Tailwind CSS v4 |
| Data fetching | TanStack Query (ready for backend) |
| Backend | Supabase (self-hosted) |
| Database | PostgreSQL |
| Package manager | pnpm |

## Project structure

```
src/
├── main.tsx              # entry point
├── App.tsx               # router
├── lib/
│   ├── types.ts          # TypeScript interfaces
│   ├── database.types.ts # auto-generated from Supabase
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # cn() helper
├── data/seed.ts          # in-memory seed data
├── pages/                # pipeline, deadlines, schedule, workload
└── components/
    ├── ui/               # shadcn/ui primitives
    ├── shared/           # project-detail panel
    └── layout/           # app shell (topbar, nav, stats bar)

supabase/
├── config.toml
├── migrations/           # SQL migrations (run in order)
└── seed.sql              # dev seed data
```

## Deployment

Production deployment (with Supabase self-hosted as the backend) will be documented once the database layer is fully connected. The app will be deployed via Docker Compose.

## License

MIT
