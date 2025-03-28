/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Ref } from 'vue'
import { nextTick, onBeforeUnmount, reactive, ref, toRefs, watch } from 'vue'
import type { Instance } from '@popperjs/core'
import { arrow, createPopper, flip, offset, preventOverflow } from '@popperjs/core'
import type { Placement } from './types'

const DEFAULT_LOCKED = false
const DEFAULT_ARROW_PADDING = 0
const DEFAULT_OFFSET_DISTANCE = 12
const DEFAULT_OFFSET_SKID = 0
const DEFAULT_PLACEMENT = 'bottom'

type Config = {
  locked?: Ref<boolean>
  arrowPadding?: Ref<number>
  offsetDistance?: Ref<number>
  offsetSkid?: Ref<number>
  placement?: Ref<Placement>
  triggerNode: Ref<HTMLElement | undefined>
  contentNode: Ref<HTMLElement | undefined>
  arrowNode?: Ref<HTMLElement | undefined> | null
}

function handleConfig(cfg: Config): Required<Config> {
  return {
    arrowPadding: cfg.arrowPadding ?? ref(DEFAULT_ARROW_PADDING),
    locked: cfg.locked ?? ref(DEFAULT_LOCKED),
    offsetDistance: cfg.offsetDistance ?? ref(DEFAULT_OFFSET_DISTANCE),
    offsetSkid: cfg.offsetSkid ?? ref(DEFAULT_OFFSET_SKID),
    placement: cfg.placement ?? ref(DEFAULT_PLACEMENT),
    triggerNode: cfg.triggerNode,
    contentNode: cfg.contentNode,
    arrowNode: cfg.arrowNode ?? null,
  }
}

export default function usePopper(cfg: Config) {
  const { arrowPadding, locked, offsetDistance, offsetSkid, placement, contentNode, triggerNode, arrowNode } = handleConfig(cfg)

  const state = reactive<{ isOpen: boolean; popperInstance: Instance | null }>({
    isOpen: false,
    popperInstance: null,
  })

  const setPopperEventListeners = (enabled: boolean) => {
    state.popperInstance?.setOptions(options => ({
      ...options,
      modifiers: [...options.modifiers!, { name: 'eventListeners', enabled }],
    }))
  }

  const enablePopperEventListeners = () => setPopperEventListeners(true)
  const disablePopperEventListeners = () => setPopperEventListeners(false)

  const close = () => {
    if (!state.isOpen)
      return
    state.isOpen = false
  }

  const open = () => {
    if (state.isOpen)
      return
    state.isOpen = true
  }

  // When isOpen or placement change
  watch([() => state.isOpen, placement], async ([isOpen]) => {
    if (isOpen) {
      await initializePopper()
      enablePopperEventListeners()
    }
    else {
      disablePopperEventListeners()
    }
  })

  async function initializePopper() {
    await nextTick()
    if (triggerNode.value === undefined) {
      console.error('triggerNode should not be undefined')
      return
    }
    if (contentNode.value === undefined) {
      console.error('contentNode should not be undefined')
      return
    }
    state.popperInstance = createPopper(triggerNode.value, contentNode.value, {
      placement: placement.value,
      modifiers: [
        preventOverflow,
        flip,
        {
          name: 'flip',
          enabled: !locked.value,
        },
        arrow,
        {
          name: 'arrow',
          options: {
            element: arrowNode?.value,
            padding: arrowPadding.value,
          },
        },
        offset,
        {
          name: 'offset',
          options: {
            offset: [offsetSkid.value, offsetDistance.value],
          },
        },
      ],
    })

    // Update its position
    state.popperInstance.update()
  }

  onBeforeUnmount(() => {
    state.popperInstance?.destroy()
  })

  return {
    ...toRefs(state),
    open,
    close,
  }
}
