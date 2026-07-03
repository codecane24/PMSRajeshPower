type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; error: string }

export function validateCreateUser(body: any): ValidationResult<{ email: string; name: string | null; password: string; departmentId: string | null; phone: string | null; address: string | null; employeeId: string | null; imageUrl: string | null }> {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid body' }
  const { email, name, password, departmentId, phone, address, employeeId, imageUrl } = body
  if (!email || typeof email !== 'string' || !email.includes('@')) return { valid: false, error: 'valid email is required' }
  if (!password || typeof password !== 'string' || password.length < 6) return { valid: false, error: 'password (min 6 chars) is required' }
  return { valid: true, value: { email: email.toLowerCase().trim(), name: name?.trim() ?? null, password, departmentId: departmentId ?? null, phone: phone?.trim() ?? null, address: address?.trim() ?? null, employeeId: employeeId?.trim() ?? null, imageUrl: imageUrl ?? null } }
}

export function validateAssignRole(body: any): ValidationResult<{ roleId: string }> {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid body' }
  const { roleId } = body
  if (!roleId || typeof roleId !== 'string') return { valid: false, error: 'roleId is required' }
  return { valid: true, value: { roleId } }
}
