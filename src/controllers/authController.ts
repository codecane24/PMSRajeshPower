import prisma from '../../lib/prisma'
import { verifyPassword, hashPassword } from '../utils/hash'
import * as jwt from '../utils/jwt'
import { randomBytes } from 'crypto'

function jsonResponse(data: any, status = 200, headers: Record<string,string> = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json', ...headers } })
}

function cookieString(name: string, value: string, opts: any = {}) {
  const parts = [`${name}=${value}`]
  if (opts.httpOnly) parts.push('HttpOnly')
  if (opts.secure) parts.push('Secure')
  if (opts.sameSite) parts.push(`SameSite=${opts.sameSite}`)
  if (opts.path) parts.push(`Path=${opts.path}`)
  if (opts.maxAge) parts.push(`Max-Age=${opts.maxAge}`)
  return parts.join('; ')
}

function computeRedirectForRoles(roles: string[]) {
  if (!roles || roles.length === 0) return '/dashboard'
  if (roles.includes('superuser')) return '/dashboard/superadmin'
  if (roles.includes('admin')) return '/dashboard/admin'
  if (roles.includes('storemanager')) return '/dashboard/store'
  if (roles.includes('purchasemanager')) return '/dashboard/purchase'
  return '/dashboard'
}

export async function login(req: Request) {
  try {
    const body = await req.json()
    const { email, password } = body
    if (!email || !password) return jsonResponse({ ok: false, error: 'email and password required' }, 400)
    const u = await prisma.user.findUnique({ where: { email: email.toLowerCase() }, include: { roles: { include: { role: true } } } })
    if (!u) return jsonResponse({ ok: false, error: 'Invalid credentials' }, 401)
    if (!u.passwordHash || !verifyPassword(password, u.passwordHash)) return jsonResponse({ ok: false, error: 'Invalid credentials' }, 401)
    const roleNames = u.roles?.map((r: any) => r.role.name) ?? []
    const token = jwt.sign({ userId: u.id, roles: roleNames })
    const cookie = cookieString('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', path: '/', maxAge: 7 * 24 * 60 * 60 })
    const redirect = computeRedirectForRoles(roleNames)
    return jsonResponse({ ok: true, redirect }, 200, { 'Set-Cookie': cookie })
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function logout(_req: Request) {
  const cookie = cookieString('auth_token', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Strict', path: '/', maxAge: 0 })
  return jsonResponse({ ok: true }, 200, { 'Set-Cookie': cookie })
}

export async function me(req: Request) {
  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const match = cookieHeader.match(/auth_token=([^;]+)/)
    if (!match) return jsonResponse({ ok: false, user: null }, 200)
    const token = match[1]
    const payload: any = jwt.verify(token)
    if (!payload) return jsonResponse({ ok: false, user: null }, 200)
    const u = await prisma.user.findUnique({ where: { id: payload.userId }, include: { roles: { include: { role: true } } } })
    if (!u) return jsonResponse({ ok: false, user: null }, 200)
    const roleNames = u.roles?.map((r: any) => r.role.name) ?? []
    return jsonResponse({ ok: true, user: { id: u.id, email: u.email, name: u.name, roles: roleNames } }, 200)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function requestPasswordReset(req: Request) {
  try {
    const body = await req.json()
    const { email } = body
    if (!email) return jsonResponse({ ok: false, error: 'email required' }, 400)
    const u = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (!u) return jsonResponse({ ok: true, message: 'If that email exists, a reset was requested' }, 200)
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60) // 1 hour
    await prisma.passwordReset.create({ data: { userId: u.id, token, expiresAt } })
    // In prod: send email with link containing token; here return token for dev
    return jsonResponse({ ok: true, token }, 200)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}

export async function resetPassword(req: Request) {
  try {
    const body = await req.json()
    const { token, newPassword } = body
    if (!token || !newPassword) return jsonResponse({ ok: false, error: 'token and newPassword required' }, 400)
    const pr = await prisma.passwordReset.findUnique({ where: { token } })
    if (!pr || pr.expiresAt < new Date()) return jsonResponse({ ok: false, error: 'Invalid or expired token' }, 400)
    const passwordHash = hashPassword(newPassword)
    await prisma.user.update({ where: { id: pr.userId }, data: { passwordHash } })
    await prisma.passwordReset.deleteMany({ where: { userId: pr.userId } })
    return jsonResponse({ ok: true }, 200)
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500)
  }
}
