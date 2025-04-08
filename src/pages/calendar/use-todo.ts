import type { Ref } from 'vue'
import type { Priority, TodoItem } from '../todo/type'
import { BaseDirectory, readDir, readTextFile } from '@tauri-apps/plugin-fs'
import { ref } from 'vue'
import { TODO_DIR } from '../../global/constant'
import { validateUuid } from '../../util'
import { PRIORITY_P1, PRIORITY_P2, PRIORITY_P3, PRIORITY_P4 } from '../todo/type'

export default function useTodo(): { todoList: Ref<TodoItem[]>, doneList: Ref<TodoItem[]> } {
  const todoList = ref<TodoItem[]>([])
  const doneList = ref<TodoItem[]>([])

  load()

  async function load(): Promise<void> {
    const entries = await readDir(TODO_DIR, { baseDir: BaseDirectory.Document })
    const collect: TodoItem[] = []
    const doneCollect: TodoItem[] = []
    for (const entry of entries) {
      if (!entry.isFile) {
        continue
      }
      if (!validateUuid(entry.name)) {
        continue
      }
      const path = `${TODO_DIR}\\${entry.name}`
      const content = await readTextFile(path, { baseDir: BaseDirectory.Document })
      const item: TodoItem = JSON.parse(content)
      if (!item.done) {
        collect.push(item)
      }
      else {
        doneCollect.push(item)
      }
    }
    const mapping: Record<Priority, number> = {
      [PRIORITY_P1]: 4,
      [PRIORITY_P2]: 3,
      [PRIORITY_P3]: 2,
      [PRIORITY_P4]: 1,
    }
    todoList.value = collect.sort((a: TodoItem, b: TodoItem) => mapping[b.priority] - mapping[a.priority])
    doneList.value = doneCollect.sort((a: TodoItem, b: TodoItem) => (b.doneTime ?? 0) - (a.doneTime ?? 0))
  }

  return { todoList, doneList }
}
