const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main(){
  const emails = ['superadmin@local','admin@local']
  for (const email of emails) {
    const u = await prisma.user.findUnique({ where: { email }, include: { roles: { include: { role: true } } } })
    if (!u) {
      console.log(`${email}: NOT FOUND`)
    } else {
      const roles = (u.roles || []).map(r => r.role.name)
      console.log(`${email}: FOUND`)
      console.log(JSON.stringify({ id: u.id, email: u.email, name: u.name, roles }, null, 2))
    }
  }
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1) })
