<script setup lang="ts">
import type { Priority, TodoItem } from './type'
import { Delete, Flag, Sunny, Sunrise, Timer } from '@element-plus/icons-vue'
import { debounce } from 'lodash'
import { ref, watch } from 'vue'
import { VCheckbox, VIcon } from '../../components'
import { convertexpirationText2Timestamp, isExpirationToday, isExpirationTomorrow, isExpirationWeekend } from './expiration'
import { PRIORITY_P1, PRIORITY_P2, PRIORITY_P3, PRIORITY_P4, REPEAT_NONE, REPEAT_WHEN_DONE } from './type'

const props = defineProps<{
  item: TodoItem | null
  visible: boolean
}>()

const emit = defineEmits<{
  update: [item: TodoItem]
  remove: [uuid: string]
}>()

const EMPTY_ITEM: TodoItem = {
  uuid: '',
  title: '',
  content: '',
  done: false,
  group: '',
  priority: PRIORITY_P1,
  repeat: REPEAT_NONE,
}

const deboundSave = debounce(save, 0)

const titleFocus = ref<boolean>(false)
const contentFocus = ref<boolean>(false)

const item = ref<TodoItem>(props.item ?? { ...EMPTY_ITEM })

watch(() => props.item, () => {
  item.value = props.item ?? { ...EMPTY_ITEM }
})

watch(() => props.visible, (v) => {
  if (v === false) {
    checkForSave()
  }
})

function save(_item: TodoItem): void {
  if (props.item === null) {
    return
  }
  const item = { ..._item }
  delete (item as any).hash
  emit('update', item)
}

function handleTitleBlur(): void {
  titleFocus.value = false
  checkForSave()
}

function handleContentBlur(): void {
  contentFocus.value = false
  checkForSave()
}

function checkForSave() {
  const timer = window.setTimeout(() => {
    if (titleFocus.value === false && contentFocus.value === false) {
      deboundSave(item.value)
    }
    window.clearTimeout(timer)
  }, 500)
}

function handleSetExpiration(e: 'today' | 'tomorror' | 'week-end'): void {
  const expiration = convertexpirationText2Timestamp(e)
  item.value.expiration = expiration
}

function handleRepeat(): void {
  item.value.repeat = REPEAT_WHEN_DONE
}

function handleSetPriority(priority: Priority): void {
  item.value.priority = priority
}

function handleRemove(): void {
  const uuid = props.item?.uuid
  if (!uuid) {
    return
  }
  emit('remove', uuid)
}
</script>

<template>
  <div class="todo-detail">
    <div class="title">
      <input v-model="item.title" type="text" @focus="titleFocus = true" @blur="handleTitleBlur">
    </div>
    <div class="action-list">
      <div class="action-item action-item--icon">
        <VIcon
          class="expiration" :class="{ 'expiration--selected': isExpirationToday(item?.expiration) }"
          @click="handleSetExpiration('today')"
        >
          <Sunny />
        </VIcon>
        <VIcon
          class="expiration" :class="{ 'expiration--selected': isExpirationTomorrow(item?.expiration) }"
          @click="handleSetExpiration('tomorror')"
        >
          <Sunrise />
        </VIcon>
        <VIcon
          class="expiration" :class="{ 'expiration--selected': isExpirationWeekend(item?.expiration) }"
          @click="handleSetExpiration('week-end')"
        >
          <Timer />
        </VIcon>
      </div>
      <div class="action-item action-item--icon">
        <VIcon
          class="priority priority--p1" :class="{ 'priority--selected': item?.priority === PRIORITY_P1 }"
          @click="handleSetPriority(PRIORITY_P1)"
        >
          <Flag />
        </VIcon>
        <VIcon
          class="priority priority--p2" :class="{ 'priority--selected': item?.priority === PRIORITY_P2 }"
          @click="handleSetPriority(PRIORITY_P2)"
        >
          <Flag />
        </VIcon>
        <VIcon
          class="priority priority--p3" :class="{ 'priority--selected': item?.priority === PRIORITY_P3 }"
          @click="handleSetPriority(PRIORITY_P3)"
        >
          <Flag />
        </VIcon>
        <VIcon
          class="priority priority--p4" :class="{ 'priority--selected': item?.priority === PRIORITY_P4 }"
          @click="handleSetPriority(PRIORITY_P4)"
        >
          <Flag />
        </VIcon>
      </div>
      <div class="action-item" @click="handleRemove">
        <VIcon class="action-item--label">
          <Delete />
        </VIcon>
        <div>删除</div>
      </div>
      <div class="action-item" @click="handleRepeat">
        <VCheckbox :checked="item?.repeat === REPEAT_WHEN_DONE" class="action-item--label" />
        <div>设为重复任务</div>
      </div>
    </div>
    <div class="content">
      <div class="hide-content">
        {{ item.content }}
      </div>
      <textarea v-model="item.content" placeholder="输入内容" @focus="contentFocus = true" @blur="handleContentBlur" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.todo-detail {
  --priority-p1: var(--v-c-error);
  --priority-p2: var(--v-c-warning);
  --priority-p3: var(--v-c-success);
  --priority-p4: var(--v-c-primary);
}

.todo-detail {
  background-color: transparent;
  display: grid;
  grid-template-columns: 300px 180px;
  grid-template-rows: 32px 1fr;

  .title {
    font-weight: bold;
    font-size: 18px;
    font-weight: bold;

    &>input {
      width: 100%;
      border: none;
      outline: none;
      padding: 0;
      font-size: inherit;
      font-weight: inherit;
      color: inherit;
    }
  }

  .action-list {
    grid-row: span 2;
    border-left: 1px solid gainsboro;
    padding-left: 8px;

    &>.action-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;
      height: 32px;
      border-radius: 4px;
      padding: 4px 12px 4px 8px;
      font-size: 14px;

      .action-item--label {
        font-size: 18px;
        margin-right: 8px;
      }

      &:hover {
        background-color: #f9f9f9;
      }

      .priority,
      .expiration {
        padding: 4px;
        border-radius: 2px;
      }

      .priority--selected,
      .expiration--selected {
        background-color: #e2e2e2;
      }

      .priority--p1 {
        color: var(--priority-p1);
      }

      .priority--p2 {
        color: var(--priority-p2);
      }

      .priority--p3 {
        color: var(--priority-p3);
      }

      .priority--p4 {
        color: var(--priority-p4);
      }
    }

    &>.action-item--icon {
      justify-content: space-between;
      font-size: 18px;
    }
  }

  .content {
    font-size: 14px;
    margin-top: 12px;
    position: relative;

    &>.hide-content {
      font-size: 14px;
      margin-top: 12px;
      visibility: hidden;
      min-height: 60px;
      white-space: pre-wrap;
    }

    &>textarea {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      min-height: 60px;
      border: none;
      outline: none;
      padding: 0;
      font-size: inherit;
      font-weight: inherit;
      color: inherit;
      resize: none;
    }
  }
}
</style>
