import { documentDir } from '@tauri-apps/api/path';
import dayjs from "dayjs";
import { appendLog } from "../invokes/file";
import { LOG_DIR } from '../global/constant';

export type LogModule = "todo" | "tool-uuid" | "other"

export type Log = {
  module: LogModule
  time: number
  content: string
}

// FIXME use rust to append log
export async function addLog(log: Omit<Log, 'time'>): Promise<void> {
  const path = `${await documentDir()}\\${LOG_DIR}\\${dayjs().format("YYYY-MM-DD")}.log`
  const time = dayjs().valueOf()
  const content = `${dayjs(time).format("YYYY-MM-DD HH:mm:ss")} [${log.module}] ${log.content}\n`
  await appendLog(path, content)
}