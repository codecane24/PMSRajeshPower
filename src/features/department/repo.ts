import prisma from '../../../lib/prisma'

export async function listDepartments() {
  return prisma.department.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { users: true } } },
  })
}

export async function createDepartment(data: { name: string; description?: string | null }) {
  return prisma.department.create({ data })
}

export async function updateDepartment(id: string, data: { name?: string; description?: string | null }) {
  return prisma.department.update({ where: { id }, data })
}

export async function deleteDepartment(id: string) {
  return prisma.department.delete({ where: { id } })
}
