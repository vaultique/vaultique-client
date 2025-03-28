/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { Ref } from 'vue'
import { unref } from 'vue'
import useEventListener from './useEventListener.ts'

export default function useClickAway(target: Ref<HTMLElement | HTMLElement[]>, handler: any) {
  const event = 'pointerdown'

  if (typeof window === 'undefined' || !window)
    return

  const listener = (event: Event) => {
    const els = unref(target)
    if (!els)
      return
    const check = (Array.isArray(els) ? els : [els]).some(x => x === event.target || event.composedPath().includes(x))
    if (check)
      return
    handler(event)
  }

  return useEventListener(window, event, listener)
}
