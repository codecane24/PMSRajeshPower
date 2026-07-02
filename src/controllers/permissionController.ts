import * as service from '../features/module/service'
import { getAuthPayload, hasAnyRole } from '../middleware/auth'

async function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

export async function createPermission(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin','superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const body = await req.json()
    const created = await service.createPermission(body)
    return jsonResponse({ ok: true, data: created }, 201)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function listPermissions(req: Request) {
  try {
    const rows = await service.listPermissions()
    return jsonResponse({ ok: true, data: rows })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}
