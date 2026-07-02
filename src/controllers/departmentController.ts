import * as service from '../features/department/service'
import { getAuthPayload, hasAnyRole } from '../middleware/auth'

async function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })
}

export async function listDepartments(req: Request) {
  try {
    const auth = getAuthPayload(req)
    if (!auth || !hasAnyRole(auth, ['admin','superuser'])) return jsonResponse({ ok: false, error: 'Forbidden' }, 403)
    const rows = await service.listDepartments()
    return jsonResponse({ ok: true, data: rows })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}
