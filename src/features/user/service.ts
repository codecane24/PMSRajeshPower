import * as repo from './repo'
import { hashPassword } from '../../utils/hash'

export async function createUser(data: { email: string; name?: string | null; password: string; departmentId?: string | null }) {
  const passwordHash = hashPassword(data.password)
  const created = await repo.createUser({ email: data.email, name: data.name, passwordHash, departmentId: data.departmentId })
  return created
}

export async function listUsers() {
  return repo.listUsers()
}

export async function getUser(id: string) {
  return repo.getUserById(id)
}

export async function updateUser(id: string, data: { name?: string | null; isActive?: boolean; departmentId?: string | null }) {
  return repo.updateUser(id, data)
}

export async function deleteUser(id: string) {
  return repo.deleteUser(id)
}

export async function assignRole(userId: string, roleId: string) {
  return repo.assignRole(userId, roleId)
}

export async function removeRole(userId: string, roleId: string) {
  return repo.removeRole(userId, roleId)
}
