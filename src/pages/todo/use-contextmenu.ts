import type { CSSProperties } from 'vue'
import type { TodoItem } from './type'
import { computed, ref } from 'vue'

const CONTEXTMENU_DEFAULT_Z_INDEX = 1000

export default function useContextMenu() {
  const visible = ref<boolean>(false)
  const position = ref<[number, number]>([0, 0])
  const item = ref<TodoItem | null>(null)
  const styles = computed<CSSProperties>(() => {
    return {
      position: 'fixed',
      zIndex: CONTEXTMENU_DEFAULT_Z_INDEX,
      left: `${position.value[0]}px`,
      top: `${position.value[1]}px`,
      display: visible.value ? 'block' : 'none',
    }
  })

  function handleContextMenu(_item: TodoItem, po: [number, number]): void {
    if (_item === undefined || _item === null) {
      return
    }
    position.value = po
    item.value = _item
    visible.value = true
  }

  function hide(): void {
    visible.value = false
    item.value = null
    position.value = [0, 0]
  }

  return { visible, position, styles, item, handleContextMenu, hide }
}
