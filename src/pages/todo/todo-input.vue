<script setup lang="ts">
import type { Component } from 'vue'
import type { Priority, TodoItem } from './type'
import { Flag, Sunny, Sunrise, Timer } from '@element-plus/icons-vue'
import { v4 as uuid } from 'uuid'
import { computed, ref } from 'vue'
import { VIcon } from '../../components'
import { validateUuid } from '../../util'
import { convertExpiration2Component, convertexpirationText2Timestamp } from './expiration'
import { PRIORITY_P1, PRIORITY_P2, PRIORITY_P3, PRIORITY_P4, REPEAT_NONE } from './type'

const props = defineProps<{ group: string }>()

const emit = defineEmits<{
  submit: [value: TodoItem]
  blur: []
}>()

const PLACEHOLDER = '准备做什么?'

const item = ref<TodoItem>(generateItem())

const focus = ref<boolean>(false)
const placeholderVisible = computed<boolean>(() => {
  return !focus.value && item.value.title === ''
})

const priorityTipClass = computed<Record<string, boolean>>(() => {
  return {
    'tip': true,
    'priority--p1': item.value.priority === PRIORITY_P1,
    'priority--p2': item.value.priority === PRIORITY_P2,
    'priority--p3': item.value.priority === PRIORITY_P3,
    'priority--p4': item.value.priority === PRIORITY_P4,
  }
})

const expirationIcon = computed<Component | null>(() => convertExpiration2Component(item.value.expiration))

function handleFocus(): void {
  focus.value = true
}

function handleBlur(): void {
  focus.value = false
  item.value = generateItem()
  emit('blur')
}

function update(e: Event): void {
  const text = (e.target as HTMLInputElement | null)?.value ?? ''
  item.value.title = text
}

function handleSubmit(): void {
  const group = props.group
  if (!validateUuid(group)) {
    console.error('Invalid group uuid: ', group)
    return
  }
  item.value.group = group
  emit('submit', item.value)
  item.value = generateItem()
  focus.value = false
}

function generateItem(): TodoItem {
  return {
    uuid: uuid(),
    title: '',
    content: '',
    done: false,
    group: props.group,
    priority: PRIORITY_P4,
    repeat: REPEAT_NONE,
  }
}

function handleSetPriority(priority: Priority): void {
  item.value.priority = priority
}

function handleSetExpiration(e: 'today' | 'tomorror' | 'week-end'): void {
  item.value.expiration = convertexpirationText2Timestamp(e)
}
</script>

<template>
  <div class="todo-input">
    <div class="todo-input__content">
      <div class="input">
        <div v-show="placeholderVisible" class="placeholder">
          {{ PLACEHOLDER }}
        </div>
        <input
          type="text" :value="item.title" @input="update" @focus="handleFocus" @blur="handleBlur"
          @keypress.enter="handleSubmit"
        >
      </div>
      <div class="tips">
        <VIcon v-if="expirationIcon" class="tip">
          <expirationIcon />
        </VIcon>
        <VIcon :class="priorityTipClass">
          <Flag />
        </VIcon>
      </div>
    </div>
    <div class="todo-input__action">
      <VIcon class="action" @click="handleSetExpiration('today')">
        <Sunny />
      </VIcon>
      <VIcon class="action" @click="handleSetExpiration('tomorror')">
        <Sunrise />
      </VIcon>
      <VIcon class="action" @click="handleSetExpiration('week-end')">
        <Timer />
      </VIcon>
      <VIcon class="action priority--p1" @click="handleSetPriority(PRIORITY_P1)">
        <Flag />
      </VIcon>
      <VIcon class="action priority--p2" @click="handleSetPriority(PRIORITY_P2)">
        <Flag />
      </VIcon>
      <VIcon class="action priority--p3" @click="handleSetPriority(PRIORITY_P3)">
        <Flag />
      </VIcon>
      <VIcon class="action priority--p4" @click="handleSetPriority(PRIORITY_P4)">
        <Flag />
      </VIcon>
    </div>
  </div>
</template>

<style lang="less" scoped>
.todo-input {
  box-shadow: 4px 4px 10px #2222221a;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 6px 12px;
  margin-top: 12px;

  &__content {
    position: relative;
    font-size: 14px;
    display: flex;
    flex-direction: row;

    .input {
      flex: 1;
      position: relative;
    }

    .tips {
      display: flex;
      flex-direction: row;
      gap: 4px;

      .tip {
        font-size: 18px;
      }
    }

    .placeholder {
      position: absolute;
      color: #b0b0b0;
      user-select: none;
      pointer-events: none;
    }

    input {
      width: 100%;
      border: none;
      outline: none;
      padding: 0;
      font-size: inherit;
      color: inherit;
    }
  }

  &__action {
    margin-top: 8px;

    .action {
      font-size: 18px;
      cursor: pointer;
    }

    .action+.action {
      margin-left: 4px;
    }

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
</style>
