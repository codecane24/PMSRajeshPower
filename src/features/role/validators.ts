type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; error: string }

export function validateCreateRole(body: any): ValidationResult<{ name: string; description: string | null }> {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid body' }
  const { name, description } = body
  if (!name || typeof name !== 'string') return { valid: false, error: 'name is required' }
  return { valid: true, value: { name: name.trim(), description: description?.trim() ?? null } }
}

export function validateUpdateRole(body: any): ValidationResult<{ description: string | null }> {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid body' }
  const { description } = body
  if (description !== undefined && typeof description !== 'string') return { valid: false, error: 'description must be string' }
  return { valid: true, value: { description: description?.trim() ?? null } }
}
