import type { Store } from '@tauri-apps/plugin-store'
import { listen } from '@tauri-apps/api/event'
import { getCurrentWindow, LogicalPosition, LogicalSize } from '@tauri-apps/api/window'
import { load } from '@tauri-apps/plugin-store'
import { debounce } from 'lodash'

const STORE_KEY_POSITION = 'win-position'
const STORE_KEY_SIZE = 'win-size'

export default function useWindow(): { init: () => Promise<void> } {
  const debounceSaveSize = debounce(saveSize, 200)
  const debounceSavePosition = debounce(savePostion, 200)
  let store: Store | undefined

  async function init() {
    store = await load('store.json', { autoSave: false })
    await loadInfo()
    await watchCurrentWindowInfo()
  }

  async function loadInfo(): Promise<void> {
    if (store === undefined) {
      return
    }
    const size = await store.get<{ w: number, h: number }>(STORE_KEY_SIZE)
    const position = await store.get<{ x: number, y: number }>(STORE_KEY_POSITION)
    const win = getCurrentWindow()
    if (size) {
      await win.setSize(new LogicalSize(size.w, size.h))
    }
    if (position) {
      await win.setPosition(new LogicalPosition(position.x, position.y))
    }
  }

  async function saveSize(w: number, h: number): Promise<void> {
    if (store === undefined) {
      return
    }
    await store.set(STORE_KEY_SIZE, { w, h })
  }

  async function savePostion(x: number, y: number): Promise<void> {
    if (store === undefined) {
      return
    }
    await store.set(STORE_KEY_POSITION, { x, y })
  }

  async function watchCurrentWindowInfo(): Promise<void> {
    await listen<{ width: number, height: number }>('tauri://resize', async (event) => {
      const { width, height } = event.payload
      debounceSaveSize(width, height)
    })

    await listen<{ x: number, y: number }>('tauri://move', async (event) => {
      const { x, y } = event.payload
      debounceSavePosition(x, y)
    })
  }

  return { init }
}
