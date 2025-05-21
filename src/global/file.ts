import type { Group } from '../pages/todo/type'
import { BaseDirectory, exists, mkdir, writeTextFile } from '@tauri-apps/plugin-fs'
import { DEFAULT_GROUP_NAME, DEFAULT_GROUP_UUID, GROUP_FILE_NAME } from '../pages/todo/constant'
import { DOCUMENT_DIR, HTTP_CACHE_DIR, KNOWLEDGE_GRAPH_DIR, KNOWLEDGE_GRAPH_FILE_EDGE, KNOWLEDGE_GRAPH_FILE_NODE, LOG_DIR, TODO_DIR } from './constant'

export default function useFile(): { init: () => Promise<void> } {
  async function init() {
    await initTodo()
    await initDocument()
    await initKnowledgeGraph()
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

  async function initKnowledgeGraph(): Promise<void> {
    const exist = await exists(KNOWLEDGE_GRAPH_DIR, { baseDir: BaseDirectory.Document })
    if (!exist) {
      await mkdir(KNOWLEDGE_GRAPH_DIR, { recursive: true, baseDir: BaseDirectory.Document })
    }
    const ne = await exists(KNOWLEDGE_GRAPH_FILE_NODE, { baseDir: BaseDirectory.Document })
    if (!ne) {
      await writeTextFile(KNOWLEDGE_GRAPH_FILE_NODE, '[]', { baseDir: BaseDirectory.Document })
    }
    const ee = await exists(KNOWLEDGE_GRAPH_FILE_EDGE, { baseDir: BaseDirectory.Document })
    if (!ee) {
      await writeTextFile(KNOWLEDGE_GRAPH_FILE_EDGE, '[]', { baseDir: BaseDirectory.Document })
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
  }

  return { init }
}
