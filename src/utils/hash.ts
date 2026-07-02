import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'

const SALT_BYTES = 16
const KEY_LEN = 64

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES).toString('hex')
  const derived = scryptSync(password, salt, KEY_LEN).toString('hex')
  return `${salt}:${derived}`
}

export function verifyPassword(password: string, stored: string): boolean {
  if (!stored || !stored.includes(':')) return false
  const [salt, derived] = stored.split(':')
  const hashed = scryptSync(password, salt, KEY_LEN).toString('hex')
  try {
    return timingSafeEqual(Buffer.from(hashed, 'hex'), Buffer.from(derived, 'hex'))
  } catch {
    return false
  }
}
