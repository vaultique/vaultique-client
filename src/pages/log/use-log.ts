import type { Ref } from 'vue'
import { BaseDirectory, readTextFileLines } from '@tauri-apps/plugin-fs'
import { ref } from 'vue'
import { LOG_DIR } from '../../global/constant'

export default function useLog(): { list: Ref<string[]> } {
  const list = ref<string[]>([])

  init()

  async function init(): Promise<void> {
    list.value = await load()
  }

  return { list }
}

async function load(): Promise<string[]> {
  const path = `${LOG_DIR}\\log.log`
  try {
    const lines = await readTextFileLines(path, { baseDir: BaseDirectory.Document })
    const li: string[] = []
    for await (const line of lines) {
      li.push(line)
    }
    return li
  }
  catch {
    return []
  }
}
