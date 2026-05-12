export interface Status {
  id: string
  label: string
  position: number
  color: string | null
}

export interface Category {
  id: string
  label: string
  color: string | null
}

export interface Profile {
  id: string
  name: string
  email: string | null
  title: string | null
  is_active: boolean
}

export interface Client {
  id: string
  name: string
}

export interface Project {
  id: string
  client_id: string
  category_id: string
  status_id: string
  description: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type TeamRole = "lead" | "reviewer" | "member"

export interface ProjectTeamMember {
  project_id: string
  profile_id: string
  role: TeamRole
}

export interface Deadline {
  id: string
  project_id: string
  label: string
  due_date: string
  completed_at: string | null
}

export interface ScheduleEntry {
  id: string
  profile_id: string
  project_id: string
  date: string
  created_at: string
}

// Joined types for UI convenience
export interface ProjectWithRelations extends Project {
  client: Client
  category: Category
  status: Status
  team: (ProjectTeamMember & { profile: Profile })[]
  deadlines: Deadline[]
}
