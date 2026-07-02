import prisma from '../../../lib/prisma'

export async function listDepartments() {
  return prisma.department.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { users: true } } },
  })
}
