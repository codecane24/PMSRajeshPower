import { validateCreateRole, validateUpdateRole } from '../features/role/validators'
import * as service from '../features/role/service'
import { getAuthPayload, hasAnyRole } from '../middleware/auth'

async function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

export async function listRoles(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    const rows = await service.listRoles()
    return jsonResponse({ ok: true, data: rows })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function createRole(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin','superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const body = await req.json()
    const v = validateCreateRole(body)
    if (!v.valid) return jsonResponse({ ok: false, error: v.error }, 400)
    const created = await service.createRole(v.value)
    return jsonResponse({ ok: true, data: created }, 201)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function getRole(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    const r = await service.getRole(id)
    if (!r) return jsonResponse({ ok: false, error: 'Not found' }, 404)
    return jsonResponse({ ok: true, data: r })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function updateRole(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin','superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    const body = await req.json()
    const v = validateUpdateRole(body)
    if (!v.valid) return jsonResponse({ ok: false, error: v.error }, 400)
    const updated = await service.updateRole(id, v.value)
    return jsonResponse({ ok: true, data: updated })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function deleteRole(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin','superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    await service.deleteRole(id)
    return jsonResponse({ ok: true })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}
