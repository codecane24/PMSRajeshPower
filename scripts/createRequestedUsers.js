const { PrismaClient } = require('@prisma/client')
const { scryptSync, randomBytes } = require('crypto')

const prisma = new PrismaClient()

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derived}`
}

async function main() {
  const users = [
    { email: 'admin@rajeshelec.com', name: 'Admin Rajesh', password: 'AdminPass123!', role: 'admin' },
    { email: 'superuser@codecane.com', name: 'Super User', password: 'SuperPass123!', role: 'superuser' },
  ]

  // ensure roles exist
  for (const u of users) {
    await prisma.role.upsert({ where: { name: u.role }, update: {}, create: { name: u.role, description: `${u.role} role` } })
  }

  const dept = await prisma.department.upsert({ where: { name: 'General' }, update: {}, create: { name: 'General', description: 'Default department' } })

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (existing) {
      console.log(`User exists: ${u.email} (id=${existing.id})`)
      // ensure role assigned
      const roleRec = await prisma.role.findUnique({ where: { name: u.role } })
      if (roleRec) {
        try { await prisma.userRole.create({ data: { userId: existing.id, roleId: roleRec.id } }); console.log(`Assigned role ${u.role} to ${u.email}`) } catch (e) { /* ignore */ }
      }
      continue
    }
    const passwordHash = hashPassword(u.password)
    const created = await prisma.user.create({ data: { email: u.email, name: u.name, passwordHash, departmentId: dept.id } })
    const roleRec = await prisma.role.findUnique({ where: { name: u.role } })
    if (roleRec) {
      await prisma.userRole.create({ data: { userId: created.id, roleId: roleRec.id } })
    }
    console.log(`Created user: ${u.email} with password: ${u.password}`)
  }
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
