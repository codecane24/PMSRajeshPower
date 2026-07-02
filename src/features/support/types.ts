export type SupportDTO = {
  id: string
  code: string
  type: string
  priority: string
  moduleId?: string | null
  title: string
  description: string
  attachmentUrl?: string | null
  completeDate?: string | null
  status: string
  commentsCount: number
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

export type SupportCommentDTO = {
  id: string
  text: string
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}
