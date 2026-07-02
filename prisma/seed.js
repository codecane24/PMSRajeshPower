const { PrismaClient } = require('@prisma/client')
const { scryptSync, randomBytes, timingSafeEqual } = require('crypto')

const prisma = new PrismaClient()

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derived}`
}

async function main() {
  const roles = ['superuser','admin','subadmin','manager','storemanager','purchasemanager','dispatchmanager','inspector']

  const upserted = {}
  for (const name of roles) {
    const r = await prisma.role.upsert({ where: { name }, update: {}, create: { name, description: `${name} role` } })
    upserted[name] = r
    console.log('Upserted role', name)
  }

  // ensure default department
  const dept = await prisma.department.upsert({ where: { name: 'General' }, update: {}, create: { name: 'General', description: 'Default department' } })
  console.log('Ensured department', dept.name)

  // ensure superadmin user
  const email = 'superadmin@local'
  const existing = await prisma.user.findUnique({ where: { email } })
  if (!existing) {
    const passwordHash = hashPassword('ChangeMe123!')
    const u = await prisma.user.create({ data: { email, name: 'Super Admin', passwordHash, departmentId: dept.id } })
    await prisma.userRole.create({ data: { userId: u.id, roleId: upserted['superuser'].id } })
    console.log('Created superadmin:', email)
  } else {
    console.log('Superadmin already exists')
  }

  // ensure admin user
  const adminEmail = 'admin@local'
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existingAdmin) {
    const passwordHash = hashPassword('Admin123!')
    const a = await prisma.user.create({ data: { email: adminEmail, name: 'Admin User', passwordHash, departmentId: dept.id } })
    await prisma.userRole.create({ data: { userId: a.id, roleId: upserted['admin'].id } })
    console.log('Created admin:', adminEmail)
  } else {
    console.log('Admin already exists')
  }

  // create a sample module, submodule, actions and permissions
  const moduleName = 'Users'
  let mod = await prisma.module.findUnique({ where: { name: moduleName } })
  if (!mod) {
    mod = await prisma.module.create({ data: { name: moduleName, description: 'User management' } })
    console.log('Created module', moduleName)
  }

  let sub = await prisma.submodule.findFirst({ where: { name: 'Management', moduleId: mod.id } })
  if (!sub) {
    sub = await prisma.submodule.create({ data: { name: 'Management', description: 'User management submodule', moduleId: mod.id } })
  }

  const actions = [ { name: 'Create', code: 'create' }, { name: 'Read', code: 'read' }, { name: 'Update', code: 'update' }, { name: 'Delete', code: 'delete' } ]
  const createdActions = []
  for (const a of actions) {
    const act = await prisma.action.upsert({ where: { code: a.code }, update: {}, create: { name: a.name, code: a.code } })
    createdActions.push(act)
  }

  const createdPermissions = []
  for (const act of createdActions) {
    let p = await prisma.permission.findFirst({ where: { moduleId: mod.id, submoduleId: sub.id, actionId: act.id } })
    if (!p) {
      p = await prisma.permission.create({ data: { moduleId: mod.id, submoduleId: sub.id, actionId: act.id, description: `${act.name} permission for Users` } })
    }
    createdPermissions.push(p)
  }

  // assign all permissions to superuser role
  const superRole = upserted['superuser']
  for (const p of createdPermissions) {
    try {
      await prisma.rolePermission.create({ data: { roleId: superRole.id, permissionId: p.id } })
    } catch (e) {
      // ignore duplicates
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
