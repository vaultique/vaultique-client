// FIXME correct validate
export function validateUuid(uuid: string): boolean {
  return typeof uuid === 'string' && uuid.length === 36
}