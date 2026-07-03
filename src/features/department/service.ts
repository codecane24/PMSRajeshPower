import * as repo from './repo'

export async function listDepartments() { return repo.listDepartments() }
export async function createDepartment(data: { name: string; description?: string | null }) { return repo.createDepartment(data) }
export async function updateDepartment(id: string, data: { name?: string; description?: string | null }) { return repo.updateDepartment(id, data) }
export async function deleteDepartment(id: string) { return repo.deleteDepartment(id) }
