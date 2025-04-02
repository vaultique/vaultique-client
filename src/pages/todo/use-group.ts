import type { Group } from './type'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { ref } from 'vue'
import { generateUuid } from '../../invokes/uuid'
import { GROUP_FILE_PATH } from './constant'

export default function useGroup() {
  const name = ref<string>('')
  const list = ref<Group[]>([])

  async function load(): Promise<void> {
    const content = await readTextFile(GROUP_FILE_PATH, { baseDir: BaseDirectory.Document })
    list.value = JSON.parse(content)
  }

  async function add(): Promise<void> {
    if (typeof name.value !== 'string' || name.value.trim() === '') {
      return
    }
    const group: Group = { uuid: await generateUuid(), name: name.value }
    list.value.push(group)
    await writeTextFile(GROUP_FILE_PATH, JSON.stringify(list.value), { baseDir: BaseDirectory.Document })
    name.value = ''
  }

  async function rename(uuid: string, text: string): Promise<void> {
    const group = list.value.find(x => x.uuid === uuid)
    if (group === undefined) {
      return
    }
    if (group.name === text) {
      return
    }
    group.name = text
    await writeTextFile(GROUP_FILE_PATH, JSON.stringify(list.value), { baseDir: BaseDirectory.Document })
  }

  return { name, list, load, add, rename }
}
