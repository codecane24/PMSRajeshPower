import * as repo from './repo'

export async function createRole(data: { name: string; description?: string | null }) {
  return repo.createRole(data)
}
export async function listRoles() { return repo.listRoles() }
export async function getRole(id: string) { return repo.getRole(id) }
export async function updateRole(id: string, data: { description?: string | null }) { return repo.updateRole(id, data) }
export async function deleteRole(id: string) { return repo.deleteRole(id) }
