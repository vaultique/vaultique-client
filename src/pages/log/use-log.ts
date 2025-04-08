import type { Ref } from 'vue'
import { BaseDirectory, readTextFileLines } from '@tauri-apps/plugin-fs'
import dayjs from 'dayjs'
import { ref } from 'vue'
import { LOG_DIR } from '../../global/constant'

export default function useLog(): { list: Ref<string[]>, date: Ref<string>, preview: () => void, next: () => void } {
  const list = ref<string[]>([])
  const date = ref<string>(dayjs().format('YYYY-MM-DD'))

  init()

  async function init(): Promise<void> {
    list.value = await load(date.value)
  }

  async function preview(): Promise<void> {
    date.value = dayjs(date.value).subtract(1, 'day').format('YYYY-MM-DD')
    list.value = await load(date.value)
  }

  async function next(): Promise<void> {
    date.value = dayjs(date.value).add(1, 'day').format('YYYY-MM-DD')
    list.value = await load(date.value)
  }

  return { list, date, preview, next }
}

async function load(date: string): Promise<string[]> {
  const path = `${LOG_DIR}\\${date}.log`
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
