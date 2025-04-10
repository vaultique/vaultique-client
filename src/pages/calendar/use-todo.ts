import type { Ref } from 'vue'
import type { Priority, TodoItem } from '../todo/type'
import { BaseDirectory, readDir, readTextFile, writeTextFile } from '@tauri-apps/plugin-fs'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'
import { TODO_DIR } from '../../global/constant'
import { validateUuid } from '../../util'
import { addLog } from '../../util/log'
import { PRIORITY_P1, PRIORITY_P2, PRIORITY_P3, PRIORITY_P4, REPEAT_WHEN_DONE } from '../todo/type'

export default function useTodo(): { todoList: Ref<TodoItem[]>, doneList: Ref<TodoItem[]>, load: () => void, setDone: (uuid: string) => Promise<void> } {
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

  // TODO 抽取公共方法
  async function setDone(uuid: string): Promise<void> {
    const item = todoList.value.find(x => x.uuid === uuid)
    if (item === undefined) {
      return
    }
    item.done = !item.done
    if (item.done === true) {
      item.doneTime = dayjs().valueOf()
    }
    else {
      delete item.doneTime
    }
    await writeTextFile(`${TODO_DIR}\\${uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document })
    await addLog({ module: 'todo', content: `完成待办: ${item.title}` })
    if (item.done && item.repeat === REPEAT_WHEN_DONE) {
      const next: TodoItem = { ...item, uuid: uuidv4(), done: false, expiration: dayjs().endOf('day').add(1, 'day').valueOf() }
      await add(next)
    }
  }

  async function add(item: TodoItem): Promise<void> {
    const { uuid, title } = item
    if (typeof title !== 'string' || title.trim() === '') {
      return
    }
    await writeTextFile(`${TODO_DIR}\\${uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document })
    await addLog({ module: 'todo', content: `新增待办: ${item.title}` })
  }

  return { todoList, doneList, load, setDone }
}
