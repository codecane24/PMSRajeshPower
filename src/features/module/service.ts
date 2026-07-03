import * as repo from './repo'

export async function createModule(data: { name: string; description?: string | null }) {
  return repo.createModule(data)
}
export async function listModules() { return repo.listModules() }
export async function updateModule(id: string, data: { name?: string; description?: string | null }) { return repo.updateModule(id, data) }
export async function createSubmodule(moduleId: string, data: { name: string; description?: string | null }) { return repo.createSubmodule(moduleId, data) }
export async function updateSubmodule(id: string, data: { name?: string; description?: string | null }) { return repo.updateSubmodule(id, data) }
export async function deleteSubmodule(id: string) { return repo.deleteSubmodule(id) }
export async function createAction(data: { name: string; code: string; description?: string | null }) { return repo.createAction(data) }
export async function upsertAction(data: { name: string; code: string }) { return repo.upsertAction(data) }
export async function createPermission(data: { moduleId: string; submoduleId?: string | null; actionId?: string | null; description?: string | null }) { return repo.createPermission(data) }
export async function getPermission(id: string) { return repo.getPermission(id) }
export async function deletePermission(id: string) { return repo.deletePermission(id) }
export async function updatePermission(id: string, data: { submoduleId?: string | null; actionId?: string | null }) { return repo.updatePermission(id, data) }
export async function listPermissions() { return repo.listPermissions() }
