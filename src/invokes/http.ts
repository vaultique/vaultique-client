import { invoke } from '@tauri-apps/api/core'

export function sendHttpRequest(options: any): Promise<any> {
  return invoke('send_http_request', { options })
}
