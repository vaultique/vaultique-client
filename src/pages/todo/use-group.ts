import type { Group } from './type'
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import { ref } from 'vue'
import { generateUuid } from '../../invokes/uuid'
import { GROUP_FILE_PATH } from './constant'

export default function useGroup() {
  const list = ref<Group[]>([])

  async function load(): Promise<void> {
    const content = await readTextFile(GROUP_FILE_PATH, { baseDir: BaseDirectory.Document })
    list.value = JSON.parse(content)
  }

  async function add(name: string): Promise<void> {
    if (typeof name !== 'string' || name.trim() === '') {
      return
    }
    const group: Group = { uuid: await generateUuid(), name }
    list.value.push(group)
    await writeTextFile(GROUP_FILE_PATH, JSON.stringify(list.value), { baseDir: BaseDirectory.Document })
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

  return { list, load, add, rename }
}
