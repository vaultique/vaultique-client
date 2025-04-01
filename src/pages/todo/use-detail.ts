import type { CSSProperties } from 'vue'
import type { TodoItem } from './type'
import { computed, ref } from 'vue'

const DETAIL_DEFAULT_Z_INDEX = 1000

export default function useDetail() {
  const visible = ref<boolean>(false)
  const item = ref<TodoItem | null>(null)
  const position = ref<[number, number]>([0, 0])
  const styles = computed<CSSProperties>(() => {
    return {
      position: 'fixed',
      zIndex: DETAIL_DEFAULT_Z_INDEX,
      left: `${position.value[0]}px`,
      top: `${position.value[1]}px`,
      display: visible.value ? 'block' : 'none',
    }
  })

  function show(_item: TodoItem, po: [number, number]): void {
    if (_item === undefined || _item === null) {
      return
    }
    item.value = _item
    position.value = po
    visible.value = true
  }

  function hide(): void {
    visible.value = false
    item.value = null
  }

  return { visible, item, styles, show, hide }
}
