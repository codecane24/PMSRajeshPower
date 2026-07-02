import jwt from '../utils/jwt'

export function getTokenFromRequest(req: Request): string | null {
  const cookieHeader = req.headers.get('cookie') || ''
  const match = cookieHeader.match(/auth_token=([^;\s]+)/)
  return match ? match[1] : null
}

export function getAuthPayload(req: Request): any | null {
  // prefer pre-parsed header set by dispatcher
  const header = req.headers.get('x-auth-payload')
  if (header) {
    try { return JSON.parse(header) } catch { /* fallthrough */ }
  }
  const token = getTokenFromRequest(req)
  if (!token) return null
  return jwt.verify(token as string)
}

export function hasAnyRole(payload: any, roles: string[]) {
  if (!payload || !payload.roles) return false
  return roles.some(r => payload.roles.includes(r))
}
