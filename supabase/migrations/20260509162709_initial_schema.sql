-- Statuses: user-defined kanban columns
create table statuses (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  position int not null default 0,
  color text
);

-- Categories: user-defined project types
create table categories (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  color text
);

-- Profiles: team members
create table profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  title text,
  is_active boolean not null default true
);

-- Clients: companies being served
create table clients (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

-- Projects: the core entity
create table projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients (id) on delete restrict,
  category_id uuid not null references categories (id) on delete restrict,
  status_id uuid not null references statuses (id) on delete restrict,
  description text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Project team: who's working on which project
create type team_role as enum ('lead', 'reviewer', 'member');

create table project_team (
  project_id uuid not null references projects (id) on delete cascade,
  profile_id uuid not null references profiles (id) on delete cascade,
  role team_role not null default 'member',
  primary key (project_id, profile_id)
);

-- Deadlines: flexible per-project deadlines
create table deadlines (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  label text not null,
  due_date date not null
);

-- Indexes
create index idx_projects_client on projects (client_id);
create index idx_projects_status on projects (status_id);
create index idx_projects_category on projects (category_id);
create index idx_project_team_profile on project_team (profile_id);
create index idx_deadlines_project on deadlines (project_id);
create index idx_deadlines_due_date on deadlines (due_date);

-- Auto-update updated_at on projects
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at();

-- RLS: enable on all tables, allow all for authenticated users
alter table statuses enable row level security;
alter table categories enable row level security;
alter table profiles enable row level security;
alter table clients enable row level security;
alter table projects enable row level security;
alter table project_team enable row level security;
alter table deadlines enable row level security;

create policy "Authenticated users have full access" on statuses
  for all using (auth.role() = 'authenticated');
create policy "Authenticated users have full access" on categories
  for all using (auth.role() = 'authenticated');
create policy "Authenticated users have full access" on profiles
  for all using (auth.role() = 'authenticated');
create policy "Authenticated users have full access" on clients
  for all using (auth.role() = 'authenticated');
create policy "Authenticated users have full access" on projects
  for all using (auth.role() = 'authenticated');
create policy "Authenticated users have full access" on project_team
  for all using (auth.role() = 'authenticated');
create policy "Authenticated users have full access" on deadlines
  for all using (auth.role() = 'authenticated');
