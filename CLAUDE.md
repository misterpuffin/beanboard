# Beanboard

## What is this

Beanboard is a self-hosted practice management dashboard for small professional service firms (accounting, audit, legal, etc.). It replaces sprawling Excel-based scheduling with a structured database and four clean views of the same data.

Built initially for a ~15-person audit firm in Singapore. Self-hosted because client data must stay on-premise.

## Core domain concepts

**Projects** are the central entity — a specific job for a client (e.g. "YE 31 Dec 2025 final audit for ADCT Technologies"). Each project has:
- A **client** (required — the company being served)
- A **category** (user-defined, e.g. Audit, Tax, Accounts) — stored in `categories` table
- A **status** that flows through a user-defined pipeline (e.g. Assigned -> In Progress -> Draft -> Review -> Final -> Sent to Client -> Billed -> Closed) — stored in `statuses` table
- A **team** via `project_team` join table, with roles: `lead`, `reviewer`, `member` (enum in code)
- **Deadlines** stored in a separate `deadlines` table — flexible, any number per project with a label and due date

Statuses and categories are **user-configurable** — stored as data, not hardcoded enums.

**Profiles** are the firm's staff. Each has a name, email, title, and active flag. Profiles are separate from auth users — a profile can exist without a login, and auth will be layered on later (potentially via Nextcloud SSO).

**Clients** are minimal — just an id and name.

## Database schema

7 tables, all simple:

| Table | Columns |
|---|---|
| **statuses** | `id`, `label`, `position`, `color` |
| **categories** | `id`, `label`, `color` |
| **profiles** | `id`, `name`, `email`, `title`, `is_active` |
| **clients** | `id`, `name` |
| **projects** | `id`, `client_id`, `category_id`, `status_id`, `description`, `notes`, `created_at`, `updated_at` |
| **project_team** | `project_id`, `profile_id`, `role` (enum: lead/reviewer/member) |
| **deadlines** | `id`, `project_id`, `label`, `due_date` |

All IDs are UUIDs. Timestamps only on `projects`. FK constraints use `on delete restrict` for reference tables and `on delete cascade` for dependent tables (project_team, deadlines).

## Four views

1. **Pipeline board** (default) — Kanban board. Columns = statuses (user-defined). Cards show client name, category badge, lead avatar, next deadline.
2. **Deadlines view** — Table sorted by upcoming deadlines. One row per deadline. Highlights overdue items in red.
3. **Schedule view** — Weekly calendar grid. Rows = team members, columns = days. (Deferred — placeholder UI only for now.)
4. **Workload view** — Bar chart of active projects per team member (as lead).

A **stats bar** is always visible at the top: active projects count, deadlines due this week, in review, sent to client.

## Current state

The frontend is **wired to Supabase**. All data is fetched via TanStack Query hooks in `src/hooks/` that call Supabase's PostgREST API. The `useProjects` hook does an embedded select that returns `ProjectWithRelations` (project + client + category + status + team + deadlines in one query). A local Supabase instance is required for development.

## Tech stack

- **Frontend**: React (Vite) + TypeScript + shadcn/ui (base-nova) + TailwindCSS v4 + TanStack Query
- **Backend**: Supabase (self-hosted) — Postgres + Auth + REST API
- **Database**: PostgreSQL (via Supabase)
- **Auth**: TBD (likely Nextcloud SSO via Supabase Auth)
- **Package manager**: pnpm

## Project structure

```
beanboard/
├── src/
│   ├── main.tsx                 # entry point (React root + providers)
│   ├── App.tsx                  # router
│   ├── lib/
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── supabase.ts          # Supabase client
│   │   └── utils.ts             # cn(), getInitials(), getProjectLead(), etc.
│   ├── hooks/
│   │   ├── use-statuses.ts      # TanStack Query hook
│   │   ├── use-categories.ts
│   │   ├── use-clients.ts
│   │   ├── use-profiles.ts
│   │   └── use-projects.ts      # embedded select → ProjectWithRelations[]
│   ├── pages/
│   │   ├── pipeline.tsx         # kanban board
│   │   ├── deadlines.tsx        # deadline table
│   │   ├── schedule.tsx         # weekly calendar (placeholder)
│   │   └── workload.tsx         # capacity chart
│   └── components/
│       ├── ui/                  # shadcn/ui primitives
│       ├── layout/
│       │   └── app-layout.tsx   # topbar + tab nav + stats bar + outlet
│       └── shared/
│           └── project-detail.tsx  # slide-out detail panel
├── supabase/
│   ├── config.toml              # Supabase CLI config
│   ├── migrations/              # SQL migrations
│   └── seed.sql                 # dev seed data (not for production)
├── public/
├── Makefile
├── .env.example
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
└── components.json              # shadcn/ui config
```

## Key architectural decisions

- **SPA, not SSR**: Internal tool with no SEO needs.
- **Supabase for API layer**: Frontend talks directly to Postgres via Supabase's auto-generated REST API. No custom backend code.
- **User-defined statuses and categories**: Stored as data, not enums. Allows customization per firm.
- **Flexible deadlines**: Separate table, any number per project, free-text labels.
- **Team roles as code enum**: `lead`, `reviewer`, `member` — structural meaning in the UI.
- **Profiles separate from auth**: Business entity exists independently of login credentials.
- **Single-tenant**: No multi-org support needed.

## Conventions

- Use `kebab-case` for file names, `PascalCase` for components
- Path alias: `@/` maps to `src/`
- Snake_case for database columns and TypeScript types that mirror the DB
- Data access is in hooks (`src/hooks/`) — pages never call Supabase directly
- Seed data uses real-ish names from the firm for realistic testing

## Development

```bash
pnpm install         # install dependencies
pnpm dev             # start Vite dev server at localhost:5173
pnpm build           # type-check + production build
pnpm lint            # run ESLint
```

### Supabase (required)

```bash
pnpm exec supabase start    # start local Supabase (Postgres, Auth, REST, Studio)
pnpm exec supabase db reset # apply migrations + seed data
pnpm dev                    # start frontend
```

Supabase Studio at `http://localhost:54323`.

### Playwright MCP

The Playwright MCP is configured with Firefox for browser automation. Standard `browser_click` calls **will time out** on shadcn/base-ui buttons due to two issues:

1. **`transition-all` + `active:translate-y-px`** on the button primitive causes Playwright's stability check to fail — the 1px animated transform on `:active` makes the bounding box shift between animation frames.
2. **Post-click waiting** — even with `force: true`, Playwright hangs after dispatching the click, likely due to how base-ui's `ButtonPrimitive` handles events or React re-renders.

**Workaround**: Use `dispatchEvent('click')` instead of `click()`:

```ts
// Via browser_run_code_unsafe:
async (page) => {
  const btn = page.locator('button:has-text("Save")');
  await btn.dispatchEvent('click');
}

// Via browser_evaluate (for simple cases):
() => document.querySelector('button').click()
```

Native `<select>`, `<input>`, and `<a>` elements work fine with standard Playwright clicks.

### Schema changes

1. `pnpm exec supabase migration new <name>` — create new migration file
2. Write SQL in `supabase/migrations/<timestamp>_<name>.sql`
3. `make db-reset` — drop and recreate the local DB
4. `make db-types` — regenerate `src/lib/database.types.ts`
5. Update `src/lib/types.ts` as needed
