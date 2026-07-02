import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'dev-secret'
const DEFAULT_EXP = '7d'

export function sign(payload: object, expiresIn = DEFAULT_EXP) {
  return jwt.sign(payload, SECRET, { expiresIn })
}

export function verify(token: string) {
  try {
    return jwt.verify(token, SECRET)
  } catch (err) {
    return null
  }
}

export default { sign, verify }
