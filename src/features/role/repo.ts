import prisma from '../../../lib/prisma'

export async function createRole(data: { name: string; description?: string | null }) {
  return prisma.role.create({ data })
}

export async function listRoles() {
  return prisma.role.findMany({
    where: { name: { not: 'superuser' } },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getRole(id: string) {
  return prisma.role.findUnique({ where: { id } })
}

export async function updateRole(id: string, data: { name: string; description?: string | null }) {
  return prisma.role.update({ where: { id }, data })
}

export async function deleteRole(id: string) {
  return prisma.role.delete({ where: { id } })
}
