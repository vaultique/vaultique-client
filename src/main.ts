import type { Group } from './pages/todo/type'
import { BaseDirectory, exists, mkdir, writeTextFile } from '@tauri-apps/plugin-fs'
import dayjs from 'dayjs'
import { createApp } from 'vue'
import App from './App.vue'
import { LOG_DIR, TODO_DIR } from './global/constant'
import { DEFAULT_GROUP_NAME, DEFAULT_GROUP_UUID, GROUP_FILE_NAME } from './pages/todo/constant'
import router from './router'
import './styles/index.less'

bootstrap()

async function bootstrap(): Promise<void> {
  await init()

  createApp(App)
    .use(router)
    .mount('#app')
}

async function init(): Promise<void> {
  // todo
  await initTodo()
  // log
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
