<script setup lang="ts">
import type { TodoItem } from './type'
import { computed } from 'vue'

const props = defineProps<{ item: TodoItem | null }>()

const emit = defineEmits<{
  update: [item: TodoItem]
}>()

const title = computed<string>({
  get() {
    return props.item?.title ?? ''
  },
  set(v: string) {
    if (props.item === null) {
      return
    }
    emit('update', { ...props.item, title: v })
  }
})
const content = computed<string>({
  get() {
    return props.item?.content ?? ''
  },
  set(v: string) {
    if (props.item === null) {
      return
    }
    emit('update', { ...props.item, content: v })
  }
})
</script>

<template>
  <div class="todo-detail">
    <div class="title">
      <input type="text" v-model="title">
    </div>
    <div class="content">
      {{ content }}
      <textarea v-model="content" placeholder="输入内容"></textarea>
    </div>
  </div>
</template>

<style lang="less" scoped>
.todo-detail {
  background-color: #ffffff;
  box-shadow: 4px 4px 10px #2222221a;
  padding: 10px 12px;
  border-radius: 8px;

  .title {
    font-weight: bold;
    font-size: 16px;
  }

  .content {
    font-size: 14px;
  }
}
</style>
