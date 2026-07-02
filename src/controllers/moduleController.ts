import { validateCreateModule, validateCreateSubmodule, validateCreateAction } from '../features/module/validators'
import * as service from '../features/module/service'
import { getAuthPayload, hasAnyRole } from '../middleware/auth'
import { hasPermission } from '../middleware/permissions'

async function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

export async function listModules(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    const rows = await service.listModules()
    return jsonResponse({ ok: true, data: rows })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function createModule(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    if (!hasAnyRole(auth, ['admin', 'superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const body = await req.json()
    const v = validateCreateModule(body)
    if (!v.valid) return jsonResponse({ ok: false, error: v.error }, 400)
    const created = await service.createModule(v.value)
    return jsonResponse({ ok: true, data: created }, 201)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function createSubmodule(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    if (!hasAnyRole(auth, ['admin', 'superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const moduleId = parts[parts.length - 2]
    const body = await req.json()
    const v = validateCreateSubmodule(body)
    if (!v.valid) return jsonResponse({ ok: false, error: v.error }, 400)
    const created = await service.createSubmodule(moduleId, v.value)
    return jsonResponse({ ok: true, data: created }, 201)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function updateModule(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    const body = await req.json()
    const updated = await service.updateModule(id, { name: body.name?.trim(), description: body.description?.trim() ?? null })
    return jsonResponse({ ok: true, data: updated })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function updateSubmodule(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    if (!hasAnyRole(auth, ['admin', 'superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    const body = await req.json()
    const updated = await service.updateSubmodule(id, { name: body.name?.trim(), description: body.description?.trim() ?? null })
    return jsonResponse({ ok: true, data: updated })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function deleteSubmodule(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    if (!hasAnyRole(auth, ['admin', 'superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const url = new URL(req.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const id = parts[parts.length - 1]
    await service.deleteSubmodule(id)
    return jsonResponse({ ok: true })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function createAction(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
    if (!hasAnyRole(auth, ['admin', 'superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const body = await req.json()
    const v = validateCreateAction(body)
    if (!v.valid) return jsonResponse({ ok: false, error: v.error }, 400)
    const created = await service.createAction(v.value)
    return jsonResponse({ ok: true, data: created }, 201)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}
