import { BaseDirectory, readDir, readTextFile, remove, writeTextFile } from "@tauri-apps/plugin-fs";
import { ref } from "vue";
import { addLog } from "../../util/log";
import { TODO_DIR } from "./constant";
import { Priority, PRIORITY_P4, TodoItem } from "./type";

export default function useTodo() {
  const list = ref<TodoItem[]>([])
  const doneList = ref<TodoItem[]>([])

  async function add(item: TodoItem): Promise<void> {
    const { uuid, title } = item
    if (typeof title !== 'string' || title.trim() === "") {
      return
    }
    await writeTextFile(TODO_DIR + `\\${uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document });
    await addLog({ module: "todo", content: `add ${item.title}` })
  }

  async function load(): Promise<void> {
    const entries = await readDir(TODO_DIR, { baseDir: BaseDirectory.Document });
    let collect: TodoItem[] = []
    let doneCollect: TodoItem[] = []
    for (const entry of entries) {
      if (!entry.isFile) {
        continue
      }
      if (!validateUuid(entry.name)) {
        continue
      }
      const path = TODO_DIR + `\\${entry.name}`
      const content = await readTextFile(path, { baseDir: BaseDirectory.Document });
      const item: TodoItem = JSON.parse(content)
      if (!item.done) {
        collect.push(item)
      } else {
        doneCollect.push(item)
      }
    }
    list.value = collect
    doneList.value = doneCollect
  }

  async function removeItem(uuid: string): Promise<void> {
    await remove(TODO_DIR + `\\${uuid}`, { baseDir: BaseDirectory.Document })
  }

  async function setDone(uuid: string): Promise<void> {
    const item = list.value.find(x => x.uuid === uuid)
    if (item === undefined) {
      return
    }
    item.done = !item.done
    await writeTextFile(TODO_DIR + `\\${uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document });
    await addLog({ module: "todo", content: `set ${item.title} done` })
  }

  async function setUnDone(uuid: string): Promise<void> {
    const item = doneList.value.find(x => x.uuid === uuid)
    if (item === undefined) {
      return
    }
    item.done = !item.done
    await writeTextFile(TODO_DIR + `\\${uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document });
    await addLog({ module: "todo", content: `set ${item.title} undone` })
  }

  async function setPriority(uuid: string, priority: Priority): Promise<void> {
    const item = list.value.find(x => x.uuid === uuid)
    if (item === undefined) {
      return
    }
    item.priority = priority
    await writeTextFile(TODO_DIR + `\\${uuid}`, JSON.stringify(item), { baseDir: BaseDirectory.Document });
    await addLog({ module: "todo", content: `set ${item.title} priority ${priority}` })
  }

  async function trans(): Promise<void> {
    const entries = await readDir(TODO_DIR, { baseDir: BaseDirectory.Document });
    for await (const entry of entries) {
      if (!entry.isFile) {
        continue
      }
      const path = TODO_DIR + `\\${entry.name}`
      if (!validateUuid(entry.name)) {
        continue
      }
      const content = await readTextFile(path, { baseDir: BaseDirectory.Document });
      const item: TodoItem = JSON.parse(content)
      item.priority = PRIORITY_P4
      await writeTextFile(TODO_DIR + `\\${entry.name}`, JSON.stringify(item), { baseDir: BaseDirectory.Document });
    }
  }

  function validateUuid(uuid: string): boolean {
    return typeof uuid === 'string' && uuid.length === 36
  }

  return { list, doneList, add, load, removeItem, setDone, setUnDone, setPriority, trans }
}
