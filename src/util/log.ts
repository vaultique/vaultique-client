import { documentDir } from '@tauri-apps/api/path'
import dayjs from 'dayjs'
import { LOG_DIR } from '../global/constant'
import { appendLog } from '../invokes/file'

export type LogModule = 'todo' | 'tool-uuid' | 'other'

export type Log = {
  module: LogModule
  time: number
  content: string
}

// TODO do not pass path as param
export async function addLog(log: Omit<Log, 'time'>): Promise<void> {
  const path = `${await documentDir()}\\${LOG_DIR}\\${dayjs().format('YYYY-MM-DD')}.log`
  const time = dayjs().valueOf()
  const content = `[${dayjs(time).format('YYYY-MM-DD')}] [${dayjs(time).format('HH:mm:ss')}] [${log.module}] ${log.content}\n`
  await appendLog(path, content)
}
