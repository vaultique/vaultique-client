import { invoke } from '@tauri-apps/api/core'

export function encode(text: string): Promise<string> {
  return invoke('encode', { text })
}

export function decode(text: string): Promise<string> {
  return invoke('decode', { text })
}
