-- Schedule entries: person X works on project Y on date Z
create table schedule_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles (id) on delete cascade,
  project_id uuid not null references projects (id) on delete cascade,
  date date not null,
  created_at timestamptz not null default now()
);

-- Prevent exact duplicates (same person, same project, same day)
create unique index idx_schedule_entries_unique
  on schedule_entries (profile_id, project_id, date);

-- Lookup by date range (weekly queries)
create index idx_schedule_entries_date on schedule_entries (date);

-- Lookup by profile
create index idx_schedule_entries_profile on schedule_entries (profile_id);

-- Lookup by project
create index idx_schedule_entries_project on schedule_entries (project_id);

-- RLS: same pattern as all other tables
alter table schedule_entries enable row level security;

create policy "Authenticated users have full access" on schedule_entries
  for all using (auth.role() = 'authenticated');
