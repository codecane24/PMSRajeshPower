import { validateCreateUser, validateAssignRole } from '../features/user/validators'
import * as service from '../features/user/service'
import { getAuthPayload, hasAnyRole } from '../middleware/auth'

async function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

export async function previewUserCode(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    const code = await service.previewUserCode()
    return jsonResponse({ ok: true, data: { code } })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function listUsers(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    const rows = await service.listUsers()
    return jsonResponse({ ok: true, data: rows })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function createUser(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin','superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const body = await req.json()
    const v = validateCreateUser(body)
    if (!v.valid) return jsonResponse({ ok: false, error: v.error }, 400)
    const created = await service.createUser(v.value)
    return jsonResponse({ ok: true, data: created }, 201)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function getUser(req: Request) {
  try {
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    const u = await service.getUser(id)
    if (!u) return jsonResponse({ ok: false, error: 'Not found' }, 404)
    return jsonResponse({ ok: true, data: u })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function updateUser(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin','superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    const body = await req.json()
    const updated = await service.updateUser(id, body)
    return jsonResponse({ ok: true, data: updated })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function deleteUser(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin','superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    await service.deleteUser(id)
    return jsonResponse({ ok: true })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function assignRole(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin','superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const userId = parts[parts.length - 2]
    const body = await req.json()
    const v = validateAssignRole(body)
    if (!v.valid) return jsonResponse({ ok: false, error: v.error }, 400)
    await service.assignRole(userId, v.value.roleId)
    return jsonResponse({ ok: true })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function removeRole(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin','superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    // .../api/users/:userId/roles/:roleId
    const roleId = parts[parts.length - 1]
    const userId = parts[parts.length - 3]
    await service.removeRole(userId, roleId)
    return jsonResponse({ ok: true })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}
