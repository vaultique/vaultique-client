<script setup lang="ts">
import { Select } from '@element-plus/icons-vue';
import { computed, toRefs } from 'vue';
import { VIcon } from "../../components";
import { convertExpiration2Text } from './expiration';
import { PRIORITY_P1, PRIORITY_P2, PRIORITY_P3, PRIORITY_P4, TodoItem } from './type';

const props = defineProps<{ item: TodoItem }>()
const emit = defineEmits<{
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
    'todo-card--p1': item.value.priority === PRIORITY_P1,
    'todo-card--p2': item.value.priority === PRIORITY_P2,
    'todo-card--p3': item.value.priority === PRIORITY_P3,
    'todo-card--p4': item.value.priority === PRIORITY_P4,
  }
})

function switchDone(): void {
  if (done.value) {
    emit('setUnDone', item.value.uuid)
  } else {
    emit('setDone', item.value.uuid)
  }
}

function handleContextmenu(e: MouseEvent): void {
  e.preventDefault()
  emit('contextmenu', item.value, [e.clientX, e.clientY])
}
</script>

<template>
  <div :class="classList" @contextmenu="handleContextmenu">
    <div class="action-container">
      <div class="todo-card__action" @click="switchDone">
        <v-icon v-show="done"><Select></Select></v-icon>
      </div>
    </div>
    <div class="content-container">
      <div class="todo-card__title">{{ title }}</div>
      <div class="expiration" v-if="expiration !== ''">{{ expiration }}</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.todo-card {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  flex-direction: row;

  &--p1 {
    --action-color: var(--priority-p1);
  }

  &--p2 {
    --action-color: var(--priority-p2);
  }

  &--p3 {
    --action-color: var(--priority-p3);
  }

  &--p4 {
    --action-color: var(--priority-p4);
  }

  &--done {
    background-color: #c9c9c9;
  }

  .action-container {
    height: 24px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .todo-card__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 2px solid var(--action-color);
    margin-right: 8px;
    cursor: pointer;
    box-sizing: border-box;
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
