<script setup lang="ts">
import { Timer, Flag } from '@element-plus/icons-vue'
import { VIcon } from "../../components";
import { computed, ref } from 'vue';

const props = defineProps<{ modelValue: string }>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'submit': []
  'blur': []
}>()

const PLACEHOLDER = "准备做什么?"

const focus = ref<boolean>(false)
const placeholderVisible = computed<boolean>(() => {
  return !focus.value && props.modelValue === ''
})

function handleFocus(): void {
  focus.value = true
}

function handleBlur(): void {
  focus.value = false
  emit('blur')
}

function update(e: Event): void {
  const text = (e.target as HTMLInputElement | null)?.value ?? ''
  emit('update:modelValue', text)
}

function handleSubmit(): void {
  emit('submit')
}
</script>

<template>
  <div class="todo-input">
    <div class="todo-input__content">
      <div class="placeholder" v-show="placeholderVisible">{{ PLACEHOLDER }}</div>
      <input type="text" :value="props.modelValue" @input="update" @focus="handleFocus" @blur="handleBlur"
        @keypress.enter="handleSubmit">
    </div>
    <div class="todo-input__action">
      <v-icon>
        <Timer />
      </v-icon>
      <v-icon>
        <Flag />
      </v-icon>
    </div>
  </div>
</template>

<style lang="less" scoped>
.todo-input {
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 6px 12px;
  margin-top: 12px;

  &__content {
    position: relative;
    font-size: 14px;

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
    .v-icon {
      color: red;
      cursor: pointer;
    }
  }
}
</style>