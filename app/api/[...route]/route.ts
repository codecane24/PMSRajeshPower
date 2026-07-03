import type { NextRequest } from 'next/server'
import * as dbController from '@/src/controllers/dbController'
import * as userController from '@/src/controllers/userController'
import * as roleController from '@/src/controllers/roleController'
import * as moduleController from '@/src/controllers/moduleController'
import * as permissionController from '@/src/controllers/permissionController'
import * as departmentController from '@/src/controllers/departmentController'
import * as supportController from '@/src/controllers/supportController'
import * as authController from '@/src/controllers/authController'
import jwt from '@/src/utils/jwt'

const routes = [
  { method: 'GET', path: /^\/api\/db-test\/?$/, handler: dbController.getDbTest },

  // Users
  { method: 'GET', path: /^\/api\/users\/preview-code\/?$/, handler: userController.previewUserCode },
  { method: 'GET', path: /^\/api\/users\/?$/, handler: userController.listUsers },
  { method: 'POST', path: /^\/api\/users\/?$/, handler: userController.createUser },
  { method: 'GET', path: /^\/api\/users\/[a-zA-Z0-9_-]+\/?$/, handler: userController.getUser },
  { method: 'PUT', path: /^\/api\/users\/[a-zA-Z0-9_-]+\/?$/, handler: userController.updateUser },
  { method: 'DELETE', path: /^\/api\/users\/[a-zA-Z0-9_-]+\/?$/, handler: userController.deleteUser },

  // Role assignment
  { method: 'POST', path: /^\/api\/users\/[a-zA-Z0-9_-]+\/roles\/?$/, handler: userController.assignRole },
  { method: 'DELETE', path: /^\/api\/users\/[a-zA-Z0-9_-]+\/roles\/[a-zA-Z0-9_-]+\/?$/, handler: userController.removeRole },

  // Roles
  { method: 'GET', path: /^\/api\/roles\/?$/, handler: roleController.listRoles },
  { method: 'POST', path: /^\/api\/roles\/?$/, handler: roleController.createRole },
  { method: 'GET', path: /^\/api\/roles\/[a-zA-Z0-9_-]+\/?$/, handler: roleController.getRole },
  { method: 'PUT', path: /^\/api\/roles\/[a-zA-Z0-9_-]+\/?$/, handler: roleController.updateRole },
  { method: 'DELETE', path: /^\/api\/roles\/[a-zA-Z0-9_-]+\/?$/, handler: roleController.deleteRole },

  // Modules & actions
  { method: 'GET', path: /^\/api\/modules\/?$/, handler: moduleController.listModules },
  { method: 'POST', path: /^\/api\/modules\/?$/, handler: moduleController.createModule },
  { method: 'PUT', path: /^\/api\/modules\/[a-zA-Z0-9_-]+\/?$/, handler: moduleController.updateModule },
  { method: 'POST', path: /^\/api\/modules\/[a-zA-Z0-9_-]+\/submodules\/?$/, handler: moduleController.createSubmodule },
  { method: 'PUT', path: /^\/api\/modules\/[a-zA-Z0-9_-]+\/submodules\/[a-zA-Z0-9_-]+\/?$/, handler: moduleController.updateSubmodule },
  { method: 'DELETE', path: /^\/api\/modules\/[a-zA-Z0-9_-]+\/submodules\/[a-zA-Z0-9_-]+\/?$/, handler: moduleController.deleteSubmodule },
  { method: 'POST', path: /^\/api\/modules\/[a-zA-Z0-9_-]+\/permissions\/?$/, handler: moduleController.createModulePermission },
  { method: 'POST', path: /^\/api\/actions\/?$/, handler: moduleController.createAction },

  // Permissions
  { method: 'GET', path: /^\/api\/permissions\/?$/, handler: permissionController.listPermissions },
  { method: 'POST', path: /^\/api\/permissions\/?$/, handler: permissionController.createPermission },
  { method: 'PUT', path: /^\/api\/permissions\/[a-zA-Z0-9_-]+\/?$/, handler: permissionController.updatePermission },
  { method: 'DELETE', path: /^\/api\/permissions\/[a-zA-Z0-9_-]+\/?$/, handler: permissionController.deletePermission },

  // Departments
  { method: 'GET', path: /^\/api\/departments\/?$/, handler: departmentController.listDepartments },
  { method: 'POST', path: /^\/api\/departments\/?$/, handler: departmentController.createDepartment },
  { method: 'PUT', path: /^\/api\/departments\/[a-zA-Z0-9_-]+\/?$/, handler: departmentController.updateDepartment },
  { method: 'DELETE', path: /^\/api\/departments\/[a-zA-Z0-9_-]+\/?$/, handler: departmentController.deleteDepartment },

  // Support
  { method: 'GET', path: /^\/api\/support\/preview-code\/?$/, handler: supportController.previewSupportCode },
  { method: 'GET', path: /^\/api\/support\/?$/, handler: supportController.listSupport },
  { method: 'POST', path: /^\/api\/support\/?$/, handler: supportController.createSupport },
  { method: 'GET', path: /^\/api\/support\/[a-zA-Z0-9_-]+\/?$/, handler: supportController.getSupport },
  { method: 'PUT', path: /^\/api\/support\/[a-zA-Z0-9_-]+\/?$/, handler: supportController.updateSupport },
  { method: 'DELETE', path: /^\/api\/support\/[a-zA-Z0-9_-]+\/?$/, handler: supportController.deleteSupport },
  { method: 'POST', path: /^\/api\/support\/[a-zA-Z0-9_-]+\/comments\/?$/, handler: supportController.addComment },
  { method: 'GET', path: /^\/api\/support\/[a-zA-Z0-9_-]+\/comments\/?$/, handler: supportController.getComments },

  // Auth
  { method: 'POST', path: /^\/api\/auth\/login\/?$/, handler: authController.login },
  { method: 'POST', path: /^\/api\/auth\/logout\/?$/, handler: authController.logout },
  { method: 'GET', path: /^\/api\/auth\/me\/?$/, handler: authController.me },
  { method: 'POST', path: /^\/api\/auth\/request-password-reset\/?$/, handler: authController.requestPasswordReset },
  { method: 'POST', path: /^\/api\/auth\/reset-password\/?$/, handler: authController.resetPassword },
]

export async function GET(req: NextRequest) { return dispatch(req) }
export async function POST(req: NextRequest) { return dispatch(req) }
export async function PUT(req: NextRequest) { return dispatch(req) }
export async function DELETE(req: NextRequest) { return dispatch(req) }

async function dispatch(req: NextRequest) {
  const url = new URL(req.url)
  const pathname = url.pathname
  const method = req.method.toUpperCase()
  const route = routes.find(r => r.method === method && r.path.test(pathname))
  if (!route) return new Response(JSON.stringify({ ok: false, error: 'Not Found' }), { status: 404, headers: { 'Content-Type': 'application/json' } })

  try {
    const cookieHeader = req.headers.get('cookie') || ''
    const match = cookieHeader.match(/auth_token=([^;\s]+)/)
    let payload = null
    if (match) payload = jwt.verify(match[1])
    if (payload) {
      const headers = new Headers(req.headers)
      headers.set('x-auth-payload', JSON.stringify(payload))
      const cloned = new Request(req.url, {
        method: req.method,
        headers,
        body: req.body,
        duplex: 'half',
      } as any)
      return await route.handler(cloned as unknown as Request)
    }
    return await route.handler(req as unknown as Request)
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
