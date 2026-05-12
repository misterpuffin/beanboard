-- Make project_id optional and add description field to schedule entries.
-- This allows non-project entries (training, admin, leave, etc.)

alter table schedule_entries
  alter column project_id drop not null;

alter table schedule_entries
  add column description text;

-- The unique constraint on (profile_id, project_id, date) no longer makes sense
-- with optional projects and free-text descriptions.
drop index idx_schedule_entries_unique;
