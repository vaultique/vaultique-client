<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import { VIcon } from '../../components'

const props = defineProps<{
  name: string
  count: number
}>()

const emit = defineEmits<{
  update: [value: string]
  add: []
}>()

const inputRef = useTemplateRef('input-ref')

const name = computed<string>(() => props.name)
const count = computed<number>(() => props.count)

const edit = ref<boolean>(false)

function changeEdit(): void {
  edit.value = !edit.value
  if (edit.value) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
}

function handleSubmit(e: Event): void {
  let text = (e.target as HTMLInputElement | null)?.value ?? ''
  text = text.trim()
  if (text === '') {
    return
  }
  emit('update', text)
  changeEdit()
}
</script>

<template>
  <div class="group-header">
    <div v-show="!edit" class="name" @click="changeEdit">
      {{ name }}
    </div>
    <div v-show="edit" class="name--input" @blur="handleSubmit" @keypress.enter="handleSubmit">
      <input ref="input-ref" type="text" :value="name">
    </div>
    <div class="count">
      {{ count }}
    </div>
    <div class="separate" />
    <VIcon class="add" @click="emit('add')">
      <Plus />
    </VIcon>
  </div>
</template>

<style lang="less" scoped>
.group-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  display: flex;
  font-size: 18px;
  margin-bottom: 12px;

  .name {
    font-weight: bold;
    cursor: pointer;

    &:hover {
      background-color: #e0e0e0;
      border-radius: 4px;
    }
  }

  .name--input {
    input {
      border: none;
      outline: none;
      width: 100%;
      background-color: transparent;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .count {
    margin-left: 8px;
    color: #949494;
  }

  .separate {
    flex: 1;
  }

  .add {
    cursor: pointer;
  }
}
</style>
