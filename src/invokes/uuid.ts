import { invoke } from '@tauri-apps/api/core'

export function generateUuid(): Promise<string> {
  return invoke('uuid_generate')
}
