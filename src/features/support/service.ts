import * as repo from './repo'
import { getNextSerialNumber } from '../../utils/serialNumber'

export async function createSupport(data: {
  type: string
  priority: string
  moduleId?: string | null
  title: string
  description: string
  attachmentUrl?: string | null
  completeDate?: Date | null
  createdBy?: string | null
}) {
  const code = await getNextSerialNumber('support_ticket')
  return repo.createSupport({ ...data, code })
}

export async function listSupport() {
  return repo.listSupport()
}

export async function getSupportById(id: string) {
  return repo.getSupportById(id)
}

export async function updateSupport(id: string, data: any) {
  return repo.updateSupport(id, data)
}

export async function deleteSupport(id: string) {
  return repo.deleteSupport(id)
}

export async function addComment(supportId: string, data: any) {
  return repo.addComment(supportId, data)
}

export async function getSupportComments(supportId: string) {
  return repo.getSupportComments(supportId)
}
