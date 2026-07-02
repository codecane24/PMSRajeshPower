import * as service from '../features/support/service'
import { getAuthPayload, hasAnyRole } from '../middleware/auth'
import { previewNextSerialNumber } from '../utils/serialNumber'

async function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

export async function previewSupportCode(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    const code = await previewNextSerialNumber('support_ticket')
    return jsonResponse({ ok: true, data: { code } })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function listSupport(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    const rows = await service.listSupport()
    return jsonResponse({ ok: true, data: rows })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function createSupport(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin', 'superuser', 'support'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const body = await req.json()
    const created = await service.createSupport(body)
    return jsonResponse({ ok: true, data: created }, 201)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function getSupport(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    const support = await service.getSupportById(id)
    if (!support) return jsonResponse({ ok: false, error: 'Not found' }, 404)
    return jsonResponse({ ok: true, data: support })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function updateSupport(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin', 'superuser', 'support'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    const body = await req.json()
    const updated = await service.updateSupport(id, body)
    return jsonResponse({ ok: true, data: updated })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function deleteSupport(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin', 'superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    await service.deleteSupport(id)
    return jsonResponse({ ok: true })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function addComment(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const supportId = parts[parts.length - 2]
    const body = await req.json()
    const comment = await service.addComment(supportId, body)
    return jsonResponse({ ok: true, data: comment }, 201)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function getComments(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const supportId = parts[parts.length - 2]
    const comments = await service.getSupportComments(supportId)
    return jsonResponse({ ok: true, data: comments })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}
