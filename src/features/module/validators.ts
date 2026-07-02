type ValidationResult<T> =
  | { valid: true; value: T }
  | { valid: false; error: string }

export function validateCreateModule(body: any): ValidationResult<{ name: string; description: string | null }> {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid body' }
  const { name, description } = body
  if (!name || typeof name !== 'string') return { valid: false, error: 'name is required' }
  return { valid: true, value: { name: name.trim(), description: description?.trim() ?? null } }
}

export function validateCreateSubmodule(body: any): ValidationResult<{ name: string; description: string | null }> {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid body' }
  const { name, description } = body
  if (!name || typeof name !== 'string') return { valid: false, error: 'name is required' }
  return { valid: true, value: { name: name.trim(), description: description?.trim() ?? null } }
}

export function validateCreateAction(body: any): ValidationResult<{ name: string; code: string; description: string | null }> {
  if (!body || typeof body !== 'object') return { valid: false, error: 'Invalid body' }
  const { name, code, description } = body
  if (!name || typeof name !== 'string') return { valid: false, error: 'name is required' }
  if (!code || typeof code !== 'string') return { valid: false, error: 'code is required' }
  return { valid: true, value: { name: name.trim(), code: code.trim(), description: description?.trim() ?? null } }
}
