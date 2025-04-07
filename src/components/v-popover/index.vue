<script setup lang="ts">
import type { Placement } from '@popperjs/core'
import type { CSSProperties } from 'vue'
import { computed, nextTick, ref, toRefs, watch } from 'vue'
import { useClickAway, usePopover, useSlotComponent } from '../../hook/popover'
import { POPOVER_NODE_INDEX, POPOVER_OFFSET_DISTANCE, POPOVER_OFFSET_SKID, POPOVER_PLACEMENT, POPOVER_PREFIX, POPOVER_TRIGGER_MODE } from './constant'
import './popover.less'

type TriggerMode = 'hover' | 'click'
type PopoverPlacement = Placement
type PopoverProps = {
  arrow?: boolean // content是否显示箭头
  placement?: PopoverPlacement // content显示位置
  offsetDistance?: number
  offsetSkid?: number
  resize?: boolean // 是否监听content元素尺寸变化并尝试翻转位置
  disabled?: boolean
  contentClass?: string // content添加额外的class
  noContentStyle?: boolean // content是否设置默认的样式
  triggerMode?: TriggerMode
}

defineOptions({ name: 'VPopover' })

const props = withDefaults(defineProps<PopoverProps>(), {
  arrow: false,
  placement: POPOVER_PLACEMENT,
  offsetDistance: POPOVER_OFFSET_DISTANCE,
  offsetSkid: POPOVER_OFFSET_SKID,
  resize: false,
  disabled: false,
  contentClass: undefined,
  noContentStyle: false,
  triggerMode: POPOVER_TRIGGER_MODE,
})

const { placement, arrow: showArrow, offsetDistance, offsetSkid } = toRefs(props)

const arrowEl = ref<HTMLElement>()
const contentEl = ref<HTMLElement>()

const { SlotComponent: TriggerComp, slotEl: triggerSlotEl, vNode: triggerVNode } = useSlotComponent()

const { isOpen, open, close } = usePopover({ contentNode: contentEl, triggerNode: triggerSlotEl, arrowNode: arrowEl, placement, offsetDistance, offsetSkid })

const popoverClass = computed<string[]>(() => generateClassNames(POPOVER_PREFIX))

const contentClass = computed<string[]>(() => {
  const result: string[] = []
  props.noContentStyle === false && result.push(`${POPOVER_PREFIX}__content`)
  typeof props.contentClass === 'string' && result.push(props.contentClass)
  return result
})

const styles = computed<CSSProperties>(() => {
  return { zIndex: POPOVER_NODE_INDEX }
})

useClickAway(computed<HTMLElement[]>(() => [contentEl.value as HTMLElement, triggerSlotEl.value as HTMLElement]), close)

function openFn(): void {
  if (props.disabled === true)
    return
  open()
}

function tryClickToggle(): void {
  if (props.triggerMode !== 'click')
    return
  isOpen.value ? close() : openFn()
}

function tryHoverOpen(): void {
  if (props.triggerMode !== 'hover')
    return
  openFn()
}

function tryHoverClose(): void {
  if (props.triggerMode !== 'hover')
    return
  close()
}

if (props.resize === true) {
  const observer = new ResizeObserver(async () => {
    if (isOpen.value === true) {
      close()
      await nextTick()
      openFn()
    }
  })

  watch([contentEl, isOpen], ([v1, v2]) => {
    if (v1 !== undefined && v2 === true)
      observer.observe(v1)
    else
      v1 && observer.unobserve(v1)
  })
}

function generateClassNames(prefix: string, ...args: (string | { label: string, exist?: boolean })[]): string[] {
  const li: string[] = [prefix]
  for (const node of args) {
    if (typeof node === 'string')
      node.trim().length > 0 && li.push(`${prefix}--${node}`)
    else
      node.exist === true && li.push(`${prefix}--${node.label}`)
  }
  return li
}
</script>

<template>
  <TriggerComp :vnode="triggerVNode" @click="tryClickToggle" @mouseover="tryHoverOpen" @mouseleave="tryHoverClose" />

  <Teleport to="body">
    <Transition :name="`${POPOVER_PREFIX}-fade`">
      <div v-show="isOpen" ref="contentEl" :class="popoverClass" :style="styles">
        <div v-if="showArrow" ref="arrowEl" data-popper-arrow :class="`${POPOVER_PREFIX}__arrow`" />
        <div :class="contentClass">
          <slot name="content" :close="close" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
