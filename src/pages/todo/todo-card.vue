<script setup lang="ts">
import { Select, CloseBold } from '@element-plus/icons-vue';
import { computed, toRefs } from 'vue';
import { VIcon } from "../../components";
import { TodoItem } from './type';

const props = defineProps<{ item: TodoItem }>()
const emit = defineEmits<{
  remove: [value: string]
  setDone: [value: string]
  setUnDone: [value: string]
}>()

const { item } = toRefs(props)

const done = computed<boolean>(() => item.value.done)
const title = computed<string>(() => item.value.title)

function switchDone(): void {
  if (done.value) {
    emit('setUnDone', item.value.uuid)
  } else {
    emit('setDone', item.value.uuid)
  }
}

function handleRemove(): void {
  emit('remove', item.value.uuid)
}
</script>

<template>
  <div class="todo-card" :class="{ 'todo-card--done': done }">
    <v-icon style="margin-right: 4px;" @click="handleRemove"><CloseBold /></v-icon>
    <div class="todo-card__action" @click="switchDone">
      <v-icon v-show="done"><Select></Select></v-icon>
    </div>
    <div class="todo-card__title">{{ title }}</div>
  </div>
</template>

<style lang="less" scoped>
.todo-card {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 4px 8px;

  display: flex;
  flex-direction: row;
  align-items: center;

  &--done {
    background-color: #c9c9c9;
  }

  &__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border: 1px solid #000000;
    margin-right: 8px;
    cursor: pointer;
  }

  &__title {
    font-size: 16px;
  }
}
</style>
