import * as repo from './repo'
import { hashPassword } from '../../utils/hash'
import { getNextSerialNumber, previewNextSerialNumber } from '../../utils/serialNumber'

export async function createUser(data: { email: string; name?: string | null; password: string; departmentId?: string | null; phone?: string | null; address?: string | null; employeeId?: string | null; imageUrl?: string | null }) {
  const passwordHash = hashPassword(data.password)
  const code = await getNextSerialNumber('user_code')
  return repo.createUser({ email: data.email, name: data.name, passwordHash, departmentId: data.departmentId, code, phone: data.phone, address: data.address, employeeId: data.employeeId, imageUrl: data.imageUrl })
}

export async function previewUserCode() {
  return previewNextSerialNumber('user_code')
}

export async function listUsers() {
  return repo.listUsers()
}

export async function getUser(id: string) {
  return repo.getUserById(id)
}

export async function updateUser(id: string, data: { name?: string | null; isActive?: boolean; departmentId?: string | null; phone?: string | null; address?: string | null; employeeId?: string | null; imageUrl?: string | null }) {
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
