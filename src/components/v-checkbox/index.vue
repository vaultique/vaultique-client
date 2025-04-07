<script setup lang="ts">
import { Select } from '@element-plus/icons-vue'
import { computed, defineComponent } from 'vue'
import { VIcon } from '../index'
import { THEME_ERROR, THEME_PRIMARY, THEME_SUCCESS, THEME_WARNING } from './constant'
import './style.less'

const props = withDefaults(defineProps<{
  theme?: string
  checked: boolean
}>(), {
  theme: THEME_PRIMARY,
})

defineComponent({ name: 'VCheckbox' })

const done = computed<boolean>(() => props.checked)

const classList = computed<Record<string, boolean>>(() => {
  return {
    'v-checkbox': true,
    'v-checkbox--primary': props.theme === THEME_PRIMARY,
    'v-checkbox--success': props.theme === THEME_SUCCESS,
    'v-checkbox--error': props.theme === THEME_ERROR,
    'v-checkbox--warning': props.theme === THEME_WARNING,
    'v-checkbox--done': props.checked,
  }
})
</script>

<template>
  <div :class="classList">
    <VIcon v-show="done" class="v-checkbox__icon">
      <Select />
    </VIcon>
  </div>
</template>

<style lang="less" scoped>
.v-checkbox {
  background-color: #ffffff;

  &:hover {
    background-color: #f0f0f0;
  }

  &--done {
    background-color: #9f9f9f;
  }

  &--done:hover {
    background-color: #727272;
  }

  &--primary {
    --border-color: var(--v-c-primary);
  }

  &--success {
    --border-color: var(--v-c-success);
  }

  &--error {
    --border-color: var(--v-c-error);
  }

  &--warning {
    --border-color: var(--v-c-warning);
  }

  &--primary&--done,
  &--success&--done,
  &--error&--done,
  &--warning&--done {
    --border-color: #9f9f9f;
  }
}

.v-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-radius: 2px;
  margin-right: 8px;
  cursor: pointer;
  box-sizing: border-box;

  &__icon {
    font-size: 16px;
    color: #ffffff;
  }
}
</style>
