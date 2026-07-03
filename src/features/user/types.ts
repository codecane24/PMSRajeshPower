export type UserDTO = {
  id: string
  code?: string | null
  email: string
  name?: string | null
  phone?: string | null
  address?: string | null
  employeeId?: string | null
  imageUrl?: string | null
  isActive: boolean
  departmentId?: string | null
  departmentName?: string | null
  roles: string[]
  lastLogin?: string | null
  createdAt: string
  updatedAt: string
}
