import { invoke } from "@tauri-apps/api/core";

export function sendHttpRequest(options: any): Promise<any> {
  console.log(options);
  return invoke("send_http_request", { options });
}