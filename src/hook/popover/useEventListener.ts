/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { isRef, onBeforeUnmount, onMounted, unref, watch } from 'vue'

export default function useEventListener(target: Window, event: keyof WindowEventMap, handler: any) {
  if (isRef(target)) {
    watch(target, (value: Window, oldValue: Window) => {
      oldValue?.removeEventListener(event, handler)
      value?.addEventListener(event, handler)
    })
  }
  else {
    onMounted(() => {
      target.addEventListener(event, handler)
    })
  }

  onBeforeUnmount(() => {
    unref(target)?.removeEventListener(event, handler)
  })
}
