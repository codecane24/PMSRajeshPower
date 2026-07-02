import prisma from '../../lib/prisma'
import { getAuthPayload } from './auth'

export async function hasPermission(req: Request, moduleName: string, actionCode: string, submoduleName?: string) {
  const payload = getAuthPayload(req)
  if (!payload) return false
  const roleNames: string[] = payload.roles || []
  if (roleNames.includes('superuser')) return true
  if (!roleNames.length) return false
  const roles = await prisma.role.findMany({ where: { name: { in: roleNames } } })
  if (!roles.length) return false
  const perm = await prisma.permission.findFirst({ where: {
    module: { name: moduleName },
    action: { code: actionCode },
    submodule: submoduleName ? { name: submoduleName } : undefined
  } })
  if (!perm) return false
  const rp = await prisma.rolePermission.findFirst({ where: { permissionId: perm.id, roleId: { in: roles.map(r => r.id) } } })
  return !!rp
}
