export type UserDTO = {
  id: string
  email: string
  name?: string | null
  isActive: boolean
  departmentId?: string | null
  departmentName?: string | null
  roles: string[]
  phone?: string | null
  lastLogin?: string | null
  createdAt: string
  updatedAt: string
}
