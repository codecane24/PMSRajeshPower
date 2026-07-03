import prisma from '../../../lib/prisma'
import { UserDTO } from './types'

export async function createUser(data: { email: string; name?: string | null; passwordHash?: string | null; departmentId?: string | null; code?: string | null; phone?: string | null; address?: string | null; employeeId?: string | null; imageUrl?: string | null }): Promise<UserDTO> {
  const created = await prisma.user.create({ data: { email: data.email, name: data.name, passwordHash: data.passwordHash, departmentId: data.departmentId, code: data.code, phone: data.phone, address: data.address, employeeId: data.employeeId, imageUrl: data.imageUrl } })
  return map(created)
}

export async function getUserById(id: string): Promise<UserDTO | null> {
  const u = await prisma.user.findUnique({ where: { id } })
  return u ? map(u) : null
}

export async function listUsers(): Promise<UserDTO[]> {
  const rows = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      department: true,
      roles: { include: { role: true } },
    },
  })

  const filtered = rows.filter((u) => !u.roles.some((userRole: any) => userRole.role.name === 'superuser'))
  return filtered.map(map)
}

export async function updateUser(id: string, data: { name?: string | null; isActive?: boolean; departmentId?: string | null; phone?: string | null; address?: string | null; employeeId?: string | null; imageUrl?: string | null }) {
  const updated = await prisma.user.update({ where: { id }, data })
  return map(updated)
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } })
  return { success: true }
}

export async function assignRole(userId: string, roleId: string) {
  // upsert-like behavior using create and ignore conflicts
  try {
    const r = await prisma.userRole.create({ data: { userId, roleId } })
    return r
  } catch (err) {
    // assume unique constraint violation => already assigned
    return null
  }
}

export async function removeRole(userId: string, roleId: string) {
  await prisma.userRole.deleteMany({ where: { userId, roleId } })
  return { success: true }
}

function map(u: any): UserDTO {
  return {
    id: u.id,
    code: u.code ?? null,
    email: u.email,
    name: u.name ?? null,
    phone: u.phone ?? null,
    address: u.address ?? null,
    employeeId: u.employeeId ?? null,
    imageUrl: u.imageUrl ?? null,
    isActive: u.isActive,
    departmentId: u.departmentId ?? null,
    departmentName: u.department?.name ?? null,
    roles: (u.roles || []).map((rr: any) => rr.role.name),
    lastLogin: u.lastLogin ? new Date(u.lastLogin).toISOString() : u.updatedAt.toISOString(),
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
  }
}
