import prisma from '../../lib/prisma'
import { ensureSerialNumbers } from '../utils/seedSerialNumbers'

export async function getDbTest(req: Request) {
  try {
    // Initialize serial numbers if needed
    await ensureSerialNumbers()
    const users = await prisma.user.findMany({ take: 5 })
    return new Response(JSON.stringify({ ok: true, count: users.length, users }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
