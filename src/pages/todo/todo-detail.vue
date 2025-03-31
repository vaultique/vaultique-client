<script setup lang="ts">
import type { TodoItem } from './type'
import { computed } from 'vue'

const props = defineProps<{ item: TodoItem | null }>()

const title = computed<string>(() => props.item?.title ?? '')
const content = computed<string>(() => props.item?.content ?? '')
</script>

<template>
  <div class="todo-detail">
    <div class="title">
      {{ title }}
    </div>
    <div class="content">
      {{ content }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.todo-detail {
  background-color: #ffffff;
  box-shadow: 4px 4px 10px #2222221a;
  padding: 10px 12px;
  border-radius: 8px;
}
</style>
