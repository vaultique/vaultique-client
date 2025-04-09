import type { Group } from '../pages/todo/type'
import { BaseDirectory, exists, mkdir, writeTextFile } from '@tauri-apps/plugin-fs'
import dayjs from 'dayjs'
import { DEFAULT_GROUP_NAME, DEFAULT_GROUP_UUID, GROUP_FILE_NAME } from '../pages/todo/constant'
import { DOCUMENT_DIR, HTTP_CACHE_DIR, LOG_DIR, TODO_DIR } from './constant'

export default function useFile(): { init: () => Promise<void> } {
  async function init() {
    await initTodo()
    await initDocument()
    await initCache()
    await initLog()
  }

  async function initTodo(): Promise<void> {
    const exist = await exists(TODO_DIR, { baseDir: BaseDirectory.Document })
    if (!exist) {
      await mkdir(TODO_DIR, { recursive: true, baseDir: BaseDirectory.Document })
    }
    const path = `${TODO_DIR}\\${GROUP_FILE_NAME}`
    const fileExist = await exists(path, { baseDir: BaseDirectory.Document })
    if (!fileExist) {
      const file: Group[] = [{ uuid: DEFAULT_GROUP_UUID, name: DEFAULT_GROUP_NAME }]
      await writeTextFile(path, JSON.stringify(file), { baseDir: BaseDirectory.Document })
    }
  }

  async function initDocument(): Promise<void> {
    const exist = await exists(DOCUMENT_DIR, { baseDir: BaseDirectory.Document })
    if (!exist) {
      await mkdir(DOCUMENT_DIR, { recursive: true, baseDir: BaseDirectory.Document })
    }
  }

  async function initCache(): Promise<void> {
    const exist = await exists(HTTP_CACHE_DIR, { baseDir: BaseDirectory.Document })
    if (!exist) {
      await mkdir(HTTP_CACHE_DIR, { recursive: true, baseDir: BaseDirectory.Document })
    }
  }

  async function initLog(): Promise<void> {
    const exist = await exists(LOG_DIR, { baseDir: BaseDirectory.Document })
    if (!exist) {
      await mkdir(LOG_DIR, { recursive: true, baseDir: BaseDirectory.Document })
    }
    const path = `${LOG_DIR}\\${dayjs().format('YYYY-MM-DD')}.log`
    const fileExist = await exists(path, { baseDir: BaseDirectory.Document })
    if (!fileExist) {
      await writeTextFile(path, '', { baseDir: BaseDirectory.Document })
    }
  }

  return { init }
}
