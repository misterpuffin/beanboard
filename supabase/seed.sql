-- Dev auth user (admin@sbtan.com / password)
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, confirmation_token, recovery_token, email_change, email_change_token_new, email_change_token_current, reauthentication_token, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values (
  'a0000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'admin@sbtan.com',
  '$2a$10$lHQAwXRwg5K4Ub12QjFsmuNKnRv.44FpR81khfaHqLOBjzqsivz3i',
  now(),
  '', '', '', '', '', '',
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{}'::jsonb,
  now(),
  now()
);

insert into auth.identities (id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
values (
  'a0000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000000',
  'a0000000-0000-0000-0000-000000000000',
  'email',
  '{"sub":"a0000000-0000-0000-0000-000000000000","email":"admin@sbtan.com"}'::jsonb,
  now(),
  now(),
  now()
);

-- Statuses (kanban columns)
insert into statuses (id, label, position, color) values
  ('a1000000-0000-0000-0000-000000000001', 'Assigned',        0, '#6b7280'),
  ('a1000000-0000-0000-0000-000000000002', 'In Progress',     1, '#3b82f6'),
  ('a1000000-0000-0000-0000-000000000003', 'Draft',           2, '#8b5cf6'),
  ('a1000000-0000-0000-0000-000000000004', 'Review',          3, '#f59e0b'),
  ('a1000000-0000-0000-0000-000000000005', 'Final',           4, '#10b981'),
  ('a1000000-0000-0000-0000-000000000006', 'Sent to Client',  5, '#06b6d4'),
  ('a1000000-0000-0000-0000-000000000007', 'Billed',          6, '#ec4899'),
  ('a1000000-0000-0000-0000-000000000008', 'Closed',          7, '#9ca3af');

-- Categories (project types)
insert into categories (id, label, color) values
  ('b1000000-0000-0000-0000-000000000001', 'Audit',        '#3b82f6'),
  ('b1000000-0000-0000-0000-000000000002', 'Tax',          '#ef4444'),
  ('b1000000-0000-0000-0000-000000000003', 'Accounts',     '#10b981'),
  ('b1000000-0000-0000-0000-000000000004', 'Solicitors',   '#8b5cf6'),
  ('b1000000-0000-0000-0000-000000000005', 'AUP',          '#f59e0b'),
  ('b1000000-0000-0000-0000-000000000006', 'GST',          '#06b6d4'),
  ('b1000000-0000-0000-0000-000000000007', 'Sales Audit',  '#ec4899'),
  ('b1000000-0000-0000-0000-000000000008', 'Event Audit',  '#f97316');

-- Profiles (team members)
insert into profiles (id, name, email, title, is_active) values
  ('c1000000-0000-0000-0000-000000000001', 'Steve',     'steve@firm.sg',     'Senior Auditor',    true),
  ('c1000000-0000-0000-0000-000000000002', 'Joey',      'joey@firm.sg',      'Senior Auditor',    true),
  ('c1000000-0000-0000-0000-000000000003', 'Zareen',    'zareen@firm.sg',    'Audit Senior',      true),
  ('c1000000-0000-0000-0000-000000000004', 'HC',        'hc@firm.sg',        'Audit Senior',      true),
  ('c1000000-0000-0000-0000-000000000005', 'John',      'john@firm.sg',      'Audit Senior',      true),
  ('c1000000-0000-0000-0000-000000000006', 'Malar',     'malar@firm.sg',     'Auditor',           true),
  ('c1000000-0000-0000-0000-000000000007', 'Charlotte', 'charlotte@firm.sg', 'Auditor',           true),
  ('c1000000-0000-0000-0000-000000000008', 'Liyana',    'liyana@firm.sg',    'Auditor',           true),
  ('c1000000-0000-0000-0000-000000000009', 'Jestinna',  'jestinna@firm.sg',  'Audit Senior',      true),
  ('c1000000-0000-0000-0000-000000000010', 'Yani',      'yani@firm.sg',      'Accounts Manager',  true),
  ('c1000000-0000-0000-0000-000000000011', 'Andrea',    'andrea@firm.sg',    'Auditor',           true),
  ('c1000000-0000-0000-0000-000000000012', 'Rohan',     'rohan@firm.sg',     'Auditor',           true),
  ('c1000000-0000-0000-0000-000000000013', 'Admin',     'admin@sbtan.com',   'Managing Director', true);

-- Clients
insert into clients (id, name) values
  ('d1000000-0000-0000-0000-000000000001', 'GBS Pte Ltd'),
  ('d1000000-0000-0000-0000-000000000002', 'Cooltech Power International Pte Ltd'),
  ('d1000000-0000-0000-0000-000000000003', 'ADCT Technologies Pte Ltd'),
  ('d1000000-0000-0000-0000-000000000004', 'Aldon Technology Pte Ltd'),
  ('d1000000-0000-0000-0000-000000000005', 'JD Pacific Pte Ltd'),
  ('d1000000-0000-0000-0000-000000000006', 'Noah''s Ark Companion Animal Rescue & Education Society'),
  ('d1000000-0000-0000-0000-000000000007', 'Brahma Kumaris Raja Yoga Centre'),
  ('d1000000-0000-0000-0000-000000000008', 'Family of Grace Evangelical Free Church'),
  ('d1000000-0000-0000-0000-000000000009', 'Chelliah & Kiang LLC'),
  ('d1000000-0000-0000-0000-000000000010', 'M&A Law Corporation'),
  ('d1000000-0000-0000-0000-000000000011', 'Seng Realty & Development Pte Ltd'),
  ('d1000000-0000-0000-0000-000000000012', 'National Aerated Water Company (Pte) Ltd'),
  ('d1000000-0000-0000-0000-000000000013', 'Institute of Estate Agents Singapore'),
  ('d1000000-0000-0000-0000-000000000014', 'Bethesda (Depot Walk) Preschool Pte Ltd'),
  ('d1000000-0000-0000-0000-000000000015', 'Bao Ling Supermart');

-- Projects
-- Assigned
insert into projects (id, client_id, category_id, status_id, description) values
  ('e1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'YE 31 Dec 2025 final audit'),
  ('e1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'YE 31 Mar 2026 audit'),
  ('e1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000014', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'YE 31 Dec 2025 audit');

-- In Progress
insert into projects (id, client_id, category_id, status_id, description, notes) values
  ('e1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'YE 31 Dec 2025 final audit', null),
  ('e1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'YE 30 Jun 2025 audit', 'Fieldwork started, pending bank confirmations'),
  ('e1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'YE 31 Dec 2025 accounts prep', null);

-- Draft
insert into projects (id, client_id, category_id, status_id, description, notes) values
  ('e1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'YE 31 Dec 2025 final audit', 'Draft report completed, pending partner review'),
  ('e1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'YE 31 Dec 2025 audit', null);

-- Review
insert into projects (id, client_id, category_id, status_id, description, notes) values
  ('e1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 'YE 31 Dec 2025 audit', 'Under partner review'),
  ('e1000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004', 'Solicitors report 2025', null);

-- Final
insert into projects (id, client_id, category_id, status_id, description, notes) values
  ('e1000000-0000-0000-0000-000000000011', 'd1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005', 'Solicitors report 2025', 'Final report ready for signing');

-- Sent to Client
insert into projects (id, client_id, category_id, status_id, description, notes) values
  ('e1000000-0000-0000-0000-000000000012', 'd1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000006', 'YE 31 Dec 2025 audit', 'Sent 20 Jan, awaiting signed copy'),
  ('e1000000-0000-0000-0000-000000000013', 'd1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000006', 'YE 31 Dec 2025 audit', 'Awaiting signed reports');

-- Billed
insert into projects (id, client_id, category_id, status_id, description) values
  ('e1000000-0000-0000-0000-000000000014', 'd1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000007', 'AUP engagement 2025'),
  ('e1000000-0000-0000-0000-000000000015', 'd1000000-0000-0000-0000-000000000015', 'b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000007', 'Tax computation YA 2025');

-- Closed
insert into projects (id, client_id, category_id, status_id, description) values
  ('e1000000-0000-0000-0000-000000000016', 'd1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000008', 'YE 31 Dec 2024 final audit'),
  ('e1000000-0000-0000-0000-000000000017', 'd1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000008', 'YE 31 Dec 2024 final audit');

-- GST
insert into projects (id, client_id, category_id, status_id, description) values
  ('e1000000-0000-0000-0000-000000000018', 'd1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'GST Oct-Dec 2025');

-- Project team assignments
-- pr1: GBS audit
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000002', 'lead'),
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'reviewer'),
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000007', 'member'),
  ('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000012', 'member');

-- pr2: Noah's Ark audit
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000003', 'lead'),
  ('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'reviewer');

-- pr3: Bethesda audit
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000005', 'lead'),
  ('e1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'reviewer');

-- pr4: ADCT audit
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'lead'),
  ('e1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000002', 'reviewer'),
  ('e1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000006', 'member'),
  ('e1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000008', 'member');

-- pr5: Aldon audit
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000009', 'lead'),
  ('e1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'reviewer');

-- pr6: JD Pacific accounts
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000010', 'lead');

-- pr7: Cooltech audit
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000002', 'lead'),
  ('e1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000001', 'reviewer'),
  ('e1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000011', 'member');

-- pr8: Brahma Kumaris audit
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000003', 'lead'),
  ('e1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000001', 'reviewer');

-- pr9: Family of Grace audit
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000005', 'lead'),
  ('e1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000001', 'reviewer'),
  ('e1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000012', 'member');

-- pr10: Chelliah & Kiang solicitors
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000004', 'lead'),
  ('e1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000002', 'reviewer');

-- pr11: M&A Law solicitors
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000009', 'lead'),
  ('e1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000001', 'reviewer');

-- pr12: Seng Realty audit
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000002', 'lead'),
  ('e1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000001', 'reviewer'),
  ('e1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000007', 'member'),
  ('e1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000006', 'member');

-- pr13: National Aerated Water audit
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000003', 'lead'),
  ('e1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000001', 'reviewer');

-- pr14: Institute of Estate Agents AUP
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000004', 'lead'),
  ('e1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000002', 'reviewer');

-- pr15: Bao Ling tax
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000010', 'lead');

-- pr18: Cooltech GST
insert into project_team (project_id, profile_id, role) values
  ('e1000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000010', 'lead');

-- Deadlines
-- pr1: GBS audit
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000001', 'Draft', '2026-03-15'),
  ('e1000000-0000-0000-0000-000000000001', 'Final', '2026-04-30');

-- pr2: Noah's Ark audit
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000002', 'Draft', '2026-06-15'),
  ('e1000000-0000-0000-0000-000000000002', 'Final', '2026-07-31');

-- pr3: Bethesda audit
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000003', 'Draft', '2026-03-01'),
  ('e1000000-0000-0000-0000-000000000003', 'Final', '2026-04-15');

-- pr4: ADCT audit
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000004', 'Draft', '2026-02-28'),
  ('e1000000-0000-0000-0000-000000000004', 'Final', '2026-03-31');

-- pr5: Aldon audit
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000005', 'Draft', '2025-09-30'),
  ('e1000000-0000-0000-0000-000000000005', 'Final', '2025-11-30');

-- pr6: JD Pacific accounts
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000006', 'Draft', '2026-02-15');

-- pr7: Cooltech audit
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000007', 'Draft', '2026-02-15'),
  ('e1000000-0000-0000-0000-000000000007', 'Final', '2026-03-31');

-- pr8: Brahma Kumaris audit
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000008', 'Draft', '2026-02-01'),
  ('e1000000-0000-0000-0000-000000000008', 'Final', '2026-03-15');

-- pr9: Family of Grace audit
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000009', 'Draft', '2026-01-15'),
  ('e1000000-0000-0000-0000-000000000009', 'Final', '2026-02-28');

-- pr10: Chelliah & Kiang solicitors
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000010', 'Draft', '2026-01-31'),
  ('e1000000-0000-0000-0000-000000000010', 'Final', '2026-02-15');

-- pr11: M&A Law solicitors
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000011', 'Final', '2026-01-31');

-- pr12: Seng Realty audit
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000012', 'Final', '2026-01-15');

-- pr13: National Aerated Water audit
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000013', 'Final', '2026-01-10');

-- pr18: Cooltech GST
insert into deadlines (project_id, label, due_date) values
  ('e1000000-0000-0000-0000-000000000018', 'Filing', '2026-01-31');
