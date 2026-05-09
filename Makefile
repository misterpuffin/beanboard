.PHONY: dev build lint db-start db-stop db-reset db-types

# Start Vite dev server
dev:
	pnpm dev

# Type-check and build
build:
	pnpm build

# Lint
lint:
	pnpm lint

# Start local Supabase
db-start:
	pnpm exec supabase start

# Stop local Supabase
db-stop:
	pnpm exec supabase stop

# Reset local DB (re-run all migrations + seed)
db-reset:
	pnpm exec supabase db reset

# Regenerate TypeScript types from local DB
db-types:
	pnpm exec supabase gen types typescript --local > src/lib/database.types.ts
