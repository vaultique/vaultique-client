import { ref } from 'vue'

export const CONTEXT_ACTION_NODE_ADD = 'node-add' as const

export default function useContext() {
  const visible = ref<boolean>(false)
  const x = ref<number>(0)
  const y = ref<number>(0)
  const actionList = ref<ContextAction[]>([])

  function mapContext(_x: number, _y: number): void {
    actionList.value = [
      { type: CONTEXT_ACTION_NODE_ADD, title: '新增节点', context: { x: _x, y: _y } },
    ]
    x.value = _x
    y.value = _y
    visible.value = true
  }

  return { visible, x, y, actionList, mapContext }
}

export type ContextAction =
| { type: typeof CONTEXT_ACTION_NODE_ADD, title: string, context: { x: number, y: number } }
