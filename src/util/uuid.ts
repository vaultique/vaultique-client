export function validateUuid(uuid: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (typeof uuid !== 'string' || uuid.length !== 36) {
    return false
  }
  return regex.test(uuid)
}
