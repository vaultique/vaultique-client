import type { VNode } from 'vue'
import { computed, ref, useSlots } from 'vue'
import slotFactory from './slotFactory'

export default function useSlotComponent(name = 'default') {
  const slots = useSlots()
  const slotEl = ref<HTMLElement>()
  const vNode = computed<VNode | undefined>(() => {
    return slots[name]?.()[0]
  })

  const SlotComponent = slotFactory({
    mountedCallFun: (el: HTMLElement): void => {
      slotEl.value = el
    },
    updatedCallFun: (el: HTMLElement): void => {
      slotEl.value = el
    },
    unmountedCallFun: (): void => {
      slotEl.value = undefined
    },
  })

  return { SlotComponent, slotEl, vNode }
}
