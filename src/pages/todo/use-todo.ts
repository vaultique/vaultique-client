import type { Priority, Repeat, TodoItem } from './type'
import { BaseDirectory, readDir, readTextFile, remove, writeTextFile } from '@tauri-apps/plugin-fs'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import { ref } from 'vue'
import { TODO_DIR } from '../../global/constant'
import { addLog } from '../../util/log'
import { PRIORITY_P1, PRIORITY_P2, PRIORITY_P3, PRIORITY_P4, REPEAT_WHEN_DONE } from './type'

export default function useTodo() {
  const list = ref<TodoItem[]>([])
  const doneList = ref<TodoItem[]>([])

  async function add(item: TodoItem): Promise<void> {
    const { uuid, title } = item
    if (typeof title !== 'string' || title.trim() === '') {
      return
    }
    await writeTextFile(`${TODO_DIR}\\${uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document })
    await addLog({ module: 'todo', content: `新增待办: ${item.title}` })
  }

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
    list.value = collect.sort((a: TodoItem, b: TodoItem) => mapping[b.priority] - mapping[a.priority])
    doneList.value = doneCollect
  }

  async function removeItem(uuid: string): Promise<void> {
    await remove(`${TODO_DIR}\\${uuid}`, { baseDir: BaseDirectory.Document })
  }

  async function setDone(uuid: string): Promise<void> {
    const item = list.value.find(x => x.uuid === uuid)
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

  async function setUnDone(uuid: string): Promise<void> {
    const item = doneList.value.find(x => x.uuid === uuid)
    if (item === undefined) {
      return
    }
    item.done = !item.done
    await writeTextFile(`${TODO_DIR}\\${uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document })
    await addLog({ module: 'todo', content: `取消完成待办: ${item.title}` })
  }

  async function setPriority(uuid: string, priority: Priority): Promise<void> {
    const item = list.value.find(x => x.uuid === uuid)
    if (item === undefined) {
      return
    }
    item.priority = priority
    await writeTextFile(`${TODO_DIR}\\${uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document })
    await addLog({ module: 'todo', content: `调整待办优先级为${item.priority}: ${item.title}` })
  }

  async function setExpiration(uuid: string, expiration: number): Promise<void> {
    const item = list.value.find(x => x.uuid === uuid)
    if (item === undefined) {
      return
    }
    item.expiration = expiration
    await writeTextFile(`${TODO_DIR}\\${uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document })
    await addLog({ module: 'todo', content: `设置待办过期时间为${dayjs(expiration).format('YYYY-MM-DD')}: ${item.title}` })
  }

  async function setRepeat(uuid: string, repeat: Repeat): Promise<void> {
    const item = list.value.find(x => x.uuid === uuid)
    if (item === undefined) {
      return
    }
    item.repeat = repeat
    await writeTextFile(`${TODO_DIR}\\${uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document })
    await addLog({ module: 'todo', content: `设置待办为重复任务: ${item.title}` })
  }

  async function save(item: TodoItem): Promise<void> {
    await writeTextFile(`${TODO_DIR}\\${item.uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document })
    await addLog({ module: 'todo', content: `修改待办名称: ${item.title}` })
  }

  async function trans(): Promise<void> {
    const entries = await readDir(TODO_DIR, { baseDir: BaseDirectory.Document })
    for await (const entry of entries) {
      if (!entry.isFile) {
        continue
      }
      const path = `${TODO_DIR}\\${entry.name}`
      if (!validateUuid(entry.name)) {
        continue
      }
      const content = await readTextFile(path, { baseDir: BaseDirectory.Document })
      const item: TodoItem = JSON.parse(content)
      item.content = ''
      await writeTextFile(`${TODO_DIR}\\${entry.name}`, JSON.stringify(item), { baseDir: BaseDirectory.Document })
    }
  }

  function validateUuid(uuid: string): boolean {
    return typeof uuid === 'string' && uuid.length === 36
  }

  return { list, doneList, add, load, removeItem, setDone, setUnDone, setPriority, setExpiration, setRepeat, save, trans }
}
