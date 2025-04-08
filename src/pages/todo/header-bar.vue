<script setup lang="ts">
import type { TodoFilter } from './type'
import { Calendar } from '@element-plus/icons-vue'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { VCheckbox, VDropdown, VIcon } from '../../components'
import { TOOL_RECORD } from '../../router'
import { TODO_FILTER_EXPIRED, TODO_FILTER_NONE, TODO_FILTER_TODAY, TODO_FILTER_WEEK } from './type'

const props = defineProps<{
  modelValue: TodoFilter
}>()

const emit = defineEmits<{
  'update:model-value': [value: TodoFilter]
}>()

const filter = computed<TodoFilter>(() => props.modelValue)

const router = useRouter()

function jumpTool(item: { value: string, label: string }): void {
  router.push(`/tool/${item.value}`)
  getCurrentWindow().setTitle(item.label)
}

function jumpCalendar(): void {
  router.push('/calendar')
}

const list = Object.values(TOOL_RECORD).map((x) => {
  return { label: x.title, value: x.name }
})

function handleToday(): void {
  emit('update:model-value', filter.value === TODO_FILTER_TODAY ? TODO_FILTER_NONE : TODO_FILTER_TODAY)
}

function handleWeek(): void {
  emit('update:model-value', filter.value === TODO_FILTER_WEEK ? TODO_FILTER_NONE : TODO_FILTER_WEEK)
}

function handleExpired(): void {
  emit('update:model-value', filter.value === TODO_FILTER_EXPIRED ? TODO_FILTER_NONE : TODO_FILTER_EXPIRED)
}
</script>

<template>
  <div class="header-bar" data-tauri-drag-region>
    <div class="todo-filter">
      <VCheckbox :checked="filter === TODO_FILTER_TODAY" @click="handleToday" />
      <span @click="handleToday">只看今天</span>
      <VCheckbox :checked="filter === TODO_FILTER_WEEK" @click="handleWeek" />
      <span @click="handleWeek">只看本周</span>
      <VCheckbox :checked="filter === TODO_FILTER_EXPIRED" @click="handleExpired" />
      <span @click="handleExpired">已过期</span>
    </div>
    <div class="calendar">
      <VIcon @click="jumpCalendar">
        <Calendar />
      </VIcon>
    </div>
    <div class="separate" />
    <div class="tool-list">
      <VDropdown :list="list" @select="jumpTool">
        <span>小工具</span>
      </VDropdown>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header-bar {
  display: flex;
  background-color: #f2f5fe;
  // justify-content: space-between;
  align-items: center;
  padding: 10px;

  &:hover {
    background-color: #f2f5fe98;
  }
}

.todo-filter {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;

  &>span {
    margin-right: 10px;
  }
}

.calendar {
  cursor: pointer;
  margin-left: 20px;
}

.separate {
  flex: 1;
}

.tool-list {
  display: flex;
  gap: 10px;

  span {
    cursor: pointer;
  }
}
</style>
