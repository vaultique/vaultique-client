<script setup lang="ts">
import type { CSSProperties, Ref } from 'vue'

import { computed, ref } from 'vue'
import { useClickAway, usePopover, useSlotComponent } from '../../hook/popover'
import { DROP_DOWN_NODE_INDEX } from './constant'
import './dropdown.less'

type Option = { label: string, value: string, disabled?: boolean }
type DropDownProps = {
  list?: Option[]
  trigger?: 'click' | 'hover'
  zIndex?: number
  listClass?: string
  disabled?: boolean
}

defineOptions({ name: 'HebinDropDown' })
const props = withDefaults(defineProps<DropDownProps>(), {
  list: () => [],
  trigger: 'click',
  zIndex: DROP_DOWN_NODE_INDEX,
  listClass: '',
  disabled: false,
})

const emit = defineEmits<{
  select: [value: Option]
}>()

const DROP_DOWN_PREFIX = 'hebin-drop-down'

const contentEl = ref<HTMLElement>()
const arrowEl = ref<HTMLElement>()
const { SlotComponent: TriggerComp, slotEl: triggerSlotEl, vNode } = useSlotComponent()

const { isOpen, open, close } = usePopover({ contentNode: contentEl, triggerNode: triggerSlotEl, arrowNode: arrowEl })

const styles = computed<CSSProperties>(() => {
  return { zIndex: props.zIndex }
})

// 组件样式
const classNames = computed<string[]>(() => {
  const li = generateClassNames(DROP_DOWN_PREFIX)
  nonblankString(props.listClass) && li.push(props.listClass)
  return li
})

// 全局点击隐藏下拉
useClickAway(contentEl as Ref<HTMLElement>, close)

// 点击组件
function handleClickToggle(): void {
  if (props.disabled === true)
    return
  if (props.trigger === 'click')
    isOpen.value ? close() : open()
}

// 鼠标悬浮显示下拉
function handleMouseover(action: 'open' | 'close'): void {
  if (props.disabled === true)
    return
  if (props.trigger === 'hover') {
    action === 'open' && open()
    action === 'close' && close()
  }
}

// 点击列表
function handleSelect(v: Option): void {
  emit('select', v)
  close()
}

function nonblankString(v: unknown): boolean {
  return typeof v === 'string' && v.trim().length > 0
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

const LIST_PREFIX = 'hebin-list'
const listStyles = computed<CSSProperties>(() => {
  const result: CSSProperties = {}
  return result
})

// 组件样式
const listClass = computed<string[]>(() => generateClassNames(LIST_PREFIX, 'middle'))
</script>

<template>
  <TriggerComp :vnode="vNode" @click="handleClickToggle" @mouseover="handleMouseover('open')" />

  <Teleport to="body">
    <div v-show="isOpen" ref="contentEl" :class="classNames" :style="styles" @mouseleave="handleMouseover('close')">
      <div ref="arrowEl" data-popper-arrow :class="`${DROP_DOWN_PREFIX}__arrow`" />
      <ul :class="listClass" :style="listStyles">
        <li
          v-for="(item, i) in props.list" :key="i" :class="{ [`${LIST_PREFIX}--disabled`]: item.disabled === true }"
          @click="handleSelect(item)"
        >
          <span>{{ item.label }}</span>
        </li>
        <li v-if="list.length === 0" class="no-data">
          暂无数据
        </li>
      </ul>
    </div>
  </Teleport>
</template>
