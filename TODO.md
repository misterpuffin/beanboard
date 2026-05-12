# TODO

## Board

- [ ] Drag-and-drop to move cards between status columns
- [ ] Filter/search bar (by client name, category, team member)
- [ ] Collapse/expand columns
- [ ] Show "Final" and "Sent to Client" columns (currently cut off on smaller screens — may need horizontal scroll indicator or column width adjustments)

## Deadlines

- [ ] Sortable columns (click header to sort by client, due date, etc.)
- [ ] Filter by category, status, or team member
- [ ] Pagination or virtual scrolling for long lists

## Schedule

Goal: replace the Excel "Acct Sch" — not 1:1 parity, but cover the same needs (who's doing what, when) in a way that works as a webapp. Stay generic; don't over-fit to the current Excel workflow.

- [ ] Make project optional on schedule entries + add a description field — entries can be standalone tasks ("AML training", "office cleaning") or project work with context ("draft report review")
- [ ] Multiple entries per person per day
- [ ] Leave tracking (AL, MC, CL, BL)
- [ ] Public holidays shown on the schedule grid
- [ ] Multi-week or month view for forward planning
- [ ] Schedule entry editing (currently can only delete and recreate)

## Workload

- [ ] Show all team roles (reviewer, member), not just lead
- [ ] Click a bar to see the list of projects for that person

## Profiles & Auth

- [ ] Allow admins to manage all profiles (create, deactivate, edit)
- [ ] Password change from profile settings
- [ ] Nextcloud SSO integration (Keycloak provider is stubbed but not tested)
- [ ] Role-based access control (admin vs regular user)

## General

- [ ] Mobile/responsive layout (currently desktop-only)
- [ ] Dark mode support
- [ ] Keyboard shortcuts (e.g. `n` for new project, `/` for search)
- [ ] Notifications for approaching deadlines
- [ ] Bulk status updates (select multiple projects, change status)
- [ ] Export data (CSV/PDF reports)
- [ ] Audit log for project changes
