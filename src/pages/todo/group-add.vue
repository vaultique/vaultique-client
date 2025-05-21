<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { nextTick, ref, useTemplateRef } from 'vue'
import { VIcon } from '../../components'

const emit = defineEmits<{
  submit: [value: string]
}>()

const text = ref<string>('')
const edit = ref<boolean>(false)
const inputRef = useTemplateRef('input-ref')

function handleEdit(): void {
  edit.value = !edit.value
  if (edit.value) {
    text.value = ''
    nextTick(() => {
      inputRef.value?.focus()
    })
  }
}

function handleSubmit(): void {
  text.value = text.value.trim()
  if (text.value === '') {
    return
  }
  emit('submit', text.value)
  edit.value = false
  text.value = ''
}
</script>

<template>
  <div class="group-add" :class="{ 'group-add--edit': edit }" @click="handleEdit">
    <VIcon v-show="!edit">
      <Plus />
    </VIcon>
    <span v-show="!edit">添加分组</span>
    <input v-show="edit" ref="input-ref" v-model="text" type="text" placeholder="请输入分组名称" @click.stop @blur="handleSubmit" @keypress.enter="handleSubmit">
  </div>
</template>

<style lang="less" scoped>
.group-add {
  cursor: pointer;
  padding: 8px 4px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  color: var(--v-c-primary);

  &--edit {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f9f9f9;
  }

  &>input {
    border: none;
    outline: none;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }
}
</style>
