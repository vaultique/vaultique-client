<script setup lang="ts">
import { debounce } from 'lodash';
import { ref, watch } from 'vue';
import type { TodoItem } from './type';

const props = defineProps<{ item: TodoItem | null }>()

const emit = defineEmits<{
  update: [item: TodoItem]
}>()

const deboundSave = debounce(save, 0)

const titleFocus = ref<boolean>(false)
const contentFocus = ref<boolean>(false)


const title = ref<string>(props.item?.title ?? '')
const content = ref<string>(props.item?.content ?? '')

watch(() => props.item, () => {
  title.value = props.item?.title ?? ''
  content.value = props.item?.content ?? ''
})

function save(title: string | null, content: string | null): void {
  if (props.item === null) {
    return
  }
  const item = { ...props.item, title: title ?? props.item.title, content: content ?? props.item.content }
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
      deboundSave(title.value, content.value)
    }
    window.clearTimeout(timer)
  }, 500)
}
</script>

<template>
  <div class="todo-detail">
    <div class="title">
      <input  v-model="title" type="text" @focus="titleFocus = true" @blur="handleTitleBlur">
    </div>
    <div class="content">
      <div class="hide-content">
        {{ content }}
      </div>
      <textarea  v-model="content" placeholder="输入内容" @focus="contentFocus = true" @blur="handleContentBlur" />
    </div>
  </div>
</template>

<style lang="less" scoped>
.todo-detail {
  background-color: transparent;
  width: 300px;

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

  .hide-content {
    font-size: 14px;
    margin-top: 12px;
    visibility: hidden;
    min-height: 60px;
    white-space: pre-wrap;
  }

  .content {
    font-size: 14px;
    margin-top: 12px;
    position: relative;

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
