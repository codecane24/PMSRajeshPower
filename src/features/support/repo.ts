import prisma from '../../../lib/prisma'
import { SupportDTO, SupportCommentDTO } from './types'

export async function createSupport(data: {
  code: string
  type: string
  priority: string
  moduleId?: string | null
  title: string
  description: string
  attachmentUrl?: string | null
  completeDate?: Date | null
  createdBy?: string | null
}): Promise<SupportDTO> {
  const created = await prisma.support.create({
    data,
    include: { comments: true },
  })
  return map(created)
}

export async function listSupport(): Promise<SupportDTO[]> {
  const rows = await prisma.support.findMany({
    orderBy: { createdAt: 'desc' },
    include: { comments: true },
    take: 100,
  })
  return rows.map(map)
}

export async function getSupportById(id: string): Promise<SupportDTO | null> {
  const support = await prisma.support.findUnique({
    where: { id },
    include: { comments: true },
  })
  return support ? map(support) : null
}

export async function updateSupport(
  id: string,
  data: {
    status?: string
    priority?: string
    completeDate?: Date | null
    description?: string
  }
): Promise<SupportDTO> {
  const updated = await prisma.support.update({
    where: { id },
    data,
    include: { comments: true },
  })
  return map(updated)
}

export async function deleteSupport(id: string) {
  await prisma.support.delete({ where: { id } })
  return { success: true }
}

export async function addComment(supportId: string, data: { text: string; createdBy?: string | null }): Promise<SupportCommentDTO> {
  const comment = await prisma.supportComment.create({
    data: { supportId, ...data },
  })
  return {
    id: comment.id,
    text: comment.text,
    createdBy: comment.createdBy ?? undefined,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  }
}

export async function getSupportComments(supportId: string): Promise<SupportCommentDTO[]> {
  const comments = await prisma.supportComment.findMany({
    where: { supportId },
    orderBy: { createdAt: 'desc' },
  })
  return comments.map((c) => ({
    id: c.id,
    text: c.text,
    createdBy: c.createdBy ?? undefined,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }))
}

function map(s: any): SupportDTO {
  return {
    id: s.id,
    code: s.code,
    type: s.type,
    priority: s.priority,
    moduleId: s.moduleId ?? null,
    title: s.title,
    description: s.description,
    attachmentUrl: s.attachmentUrl ?? null,
    completeDate: s.completeDate ? s.completeDate.toISOString() : null,
    status: s.status,
    commentsCount: (s.comments || []).length,
    createdBy: s.createdBy ?? null,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }
}
