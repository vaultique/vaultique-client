
import { invoke } from "@tauri-apps/api/core";

export function appendLog(path: string, text: string): Promise<string> {
  return invoke("append_log", { path, text });
}