import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs"
import dayjs from "dayjs"

// FIXME use rust to write log

export const LOG_DIR = "BaiduSyncdisk\\vaultique\\log"

export type LogModule = "todo" | "tool-uuid" | "other"

export type Log = {
  module: LogModule
  time: number
  content: string
}

// FIXME use rust to append log
export async function addLog(log: Omit<Log, 'time'>): Promise<void> {
  const path = `${LOG_DIR}\\${dayjs().format("YYYY-MM-DD")}.log`
  const time = dayjs().valueOf()
  let content = await readTextFile(path, { baseDir: BaseDirectory.Document });
  content += `${dayjs(time).format("YYYY-MM-DD HH:mm:ss")} [${log.module}] ${log.content}\n`
  await writeTextFile(path, content, { baseDir: BaseDirectory.Document });
}