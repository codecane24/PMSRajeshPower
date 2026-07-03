import prisma from '../../../lib/prisma'

export async function createModule(data: { name: string; description?: string | null }) {
  return prisma.module.create({ data })
}

export async function listModules() {
  return prisma.module.findMany({
    include: {
      submodules: true,
      permissions: {
        include: {
          action: true,
          submodule: true,
        },
      },
    },
  })
}

export async function createSubmodule(moduleId: string, data: { name: string; description?: string | null }) {
  return prisma.submodule.create({ data: { ...data, moduleId } })
}

export async function createAction(data: { name: string; code: string; description?: string | null }) {
  return prisma.action.create({ data })
}

export async function updateModule(id: string, data: { name?: string; description?: string | null }) {
  return prisma.module.update({ where: { id }, data })
}

export async function updateSubmodule(id: string, data: { name?: string; description?: string | null }) {
  return prisma.submodule.update({ where: { id }, data })
}

export async function deleteSubmodule(id: string) {
  return prisma.submodule.delete({ where: { id } })
}

export async function upsertAction(data: { name: string; code: string }) {
  return prisma.action.upsert({
    where: { code: data.code },
    create: data,
    update: { name: data.name },
  })
}

export async function createPermission(data: { moduleId: string; submoduleId?: string | null; actionId?: string | null; description?: string | null }) {
  return prisma.permission.create({ data })
}

export async function getPermission(id: string) {
  return prisma.permission.findUnique({
    where: { id },
    include: { action: true, submodule: true },
  })
}

export async function deletePermission(id: string) {
  return prisma.permission.delete({ where: { id } })
}

export async function updatePermission(id: string, data: { submoduleId?: string | null; actionId?: string | null }) {
  return prisma.permission.update({
    where: { id },
    data,
    include: { action: true, submodule: true },
  })
}

export async function listPermissions() {
  return prisma.permission.findMany({ include: { module: true, submodule: true, action: true } })
}
