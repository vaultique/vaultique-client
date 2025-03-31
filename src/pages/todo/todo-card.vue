<script setup lang="ts">
import type { Priority, TodoItem } from './type'
import { computed, toRefs } from 'vue'
import { VCheckbox } from '../../components'
import { convertExpiration2Text } from './expiration'
import { PRIORITY_P1, PRIORITY_P2, PRIORITY_P3, PRIORITY_P4 } from './type'
import { Theme, THEME_ERROR, THEME_PRIMARY, THEME_WARNING } from '../../components/v-checkbox/constant'

const props = defineProps<{ item: TodoItem }>()
const emit = defineEmits<{
  select: [item: TodoItem, position: [number, number]]
  setDone: [value: string]
  setUnDone: [value: string]
  contextmenu: [item: TodoItem, position: [number, number]]
}>()

const { item } = toRefs(props)

const done = computed<boolean>(() => item.value.done)
const title = computed<string>(() => item.value.title)
const expiration = computed<string>(() => convertExpiration2Text(item.value.expiration))
const classList = computed(() => {
  return {
    'todo-card': true,
    'todo-card--done': done.value,
  }
})
const theme = computed<Theme>(() => {
  const mapping: Record<Priority, Theme> = {
    [PRIORITY_P1]: THEME_ERROR,
    [PRIORITY_P2]: THEME_WARNING,
    [PRIORITY_P3]: THEME_PRIMARY,
    [PRIORITY_P4]: THEME_PRIMARY,
  }
  return mapping[item.value.priority]
})

function switchDone(): void {
  if (done.value) {
    emit('setUnDone', item.value.uuid)
  }
  else {
    emit('setDone', item.value.uuid)
  }
}

function handleContextmenu(e: MouseEvent): void {
  e.preventDefault()
  emit('contextmenu', item.value, [e.clientX, e.clientY])
}

function handleClick(e: MouseEvent): void {
  emit('select', item.value, [e.clientX, e.clientY])
}
</script>

<template>
  <div :class="classList" @contextmenu="handleContextmenu" @click="handleClick">
    <div class="action-container">
      <VCheckbox :checked="done" @click="switchDone" :theme="theme" />
    </div>
    <div class="content-container">
      <div class="todo-card__title">
        {{ title }}
      </div>
      <div v-if="expiration !== ''" class="expiration">
        {{ expiration }}
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.todo-card {
  font-size: 16px;
  color: #000000;

  &--done {
    color: #bebebe;
  }
}

.todo-card {
  background-color: #ffffff;
  box-shadow: 4px 4px 10px #2222221a;
  border-radius: 8px;
  padding: 4px 8px;
  display: flex;
  flex-direction: row;

  .action-container {
    height: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .content-container {
    display: flex;
    flex-direction: column;
  }

  .todo-card__title {
    font-size: 16px;
    line-height: 24px;
  }

  .expiration {
    font-size: 14px;
    color: #5a5a5a;
  }
}
</style>
