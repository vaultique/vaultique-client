import { invoke } from '@tauri-apps/api/core'

export function appendLog(text: string): Promise<string> {
  return invoke('append_log', { text })
}
