import { BaseDirectory, readDir, readTextFile, remove, writeTextFile } from "@tauri-apps/plugin-fs";
import { ref } from "vue";
import { generateUuid } from "../../invokes/uuid";
import { DEFAULT_GROUP_UUID, TODO_DIR } from "./constant";
import { TodoItem } from "./type";
import { addLog } from "../../util/log";

export default function useTodo() {
  const text = ref<string>("")
  const list = ref<TodoItem[]>([])
  const doneList = ref<TodoItem[]>([])

  async function add(group: string): Promise<void> {
    if (typeof text.value !== 'string' || text.value.trim() === "") {
      return
    }
    const id = await generateUuid();
    const item: TodoItem = { uuid: id, title: text.value, group, done: false }
    await writeTextFile(TODO_DIR + `\\${id}`, JSON.stringify(item), { baseDir: BaseDirectory.Document });
    await addLog({ module: "todo", content: `add ${item.title}` })
    text.value = ''
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

  async function trans(): Promise<void> {
    const entries = await readDir(TODO_DIR, { baseDir: BaseDirectory.Document });
    for await (const entry of entries) {
      if (!entry.isFile) {
        continue
      }
      const path = TODO_DIR + `\\${entry.name}`
      const content = await readTextFile(path, { baseDir: BaseDirectory.Document });
      const item: TodoItem = { uuid: entry.name, title: content, group: DEFAULT_GROUP_UUID, done: false }
      await writeTextFile(TODO_DIR + `\\${entry.name}`, JSON.stringify(item), { baseDir: BaseDirectory.Document });
    }
  }

  function validateUuid(uuid: string): boolean {
    return typeof uuid === 'string' && uuid.length === 36
  }

  return { text, list, doneList, add, load, removeItem, setDone, setUnDone, trans }
}
