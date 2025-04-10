<script setup lang="ts">
import type { CalendarMode } from '../../global'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { CALENDAR_MODE_MONTH, CALENDAR_MODE_WEEK } from '../../global'

const props = defineProps<{
  month: string
  week: string
  mode: CalendarMode
}>()

const emit = defineEmits<{
  previewMonth: []
  previewWeek: []
  nextMonth: []
  nextWeek: []
  switch: [mode: CalendarMode]
}>()

const month = computed<string>(() => props.month)
const week = computed<string>(() => props.week)
const mode = computed<CalendarMode>(() => props.mode)

const router = useRouter()

function jumpToToolList(): void {
  router.back()
}

function handleNextMonth(): void {
  emit('nextMonth')
}
function handleNextWeek(): void {
  emit('nextWeek')
}

function handlePreviewMonth(): void {
  emit('previewMonth')
}
function handlePreviewWeek(): void {
  emit('previewWeek')
}

function handleSwitch(m: CalendarMode): void {
  if (m === mode.value) {
    return
  }
  emit('switch', m)
}
</script>

<template>
  <div class="header-bar" data-tauri-drag-region>
    <button @click="jumpToToolList">
      首页
    </button>
    <div class="mode-switch">
      <div :class="{ active: mode === CALENDAR_MODE_WEEK }" @click="handleSwitch(CALENDAR_MODE_WEEK)">
        周视图
      </div>
      <div :class="{ active: mode === CALENDAR_MODE_MONTH }" @click="handleSwitch(CALENDAR_MODE_MONTH)">
        月视图
      </div>
    </div>
    <div v-show="mode === CALENDAR_MODE_WEEK" class="week-action">
      <button @click="handlePreviewWeek">
        上周
      </button>
      <div>{{ week }}</div>
      <button @click="handleNextWeek">
        下周
      </button>
    </div>
    <div v-show="mode === CALENDAR_MODE_MONTH" class="month-action">
      <button @click="handlePreviewMonth">
        上月
      </button>
      <div>{{ month }}</div>
      <button @click="handleNextMonth">
        下月
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  gap: 12px;
  padding: 10px;

  .mode-switch {
    display: flex;
    flex-direction: row;
    border-radius: 4px;
    border: 1px solid #808080;
    box-sizing: border-box;
    user-select: none;

    &>div {
      padding: 2px 6px;
      cursor: pointer;
    }

    &>div:first-child {
      border-radius: 4px 0 0 4px;
    }

    &>div:last-child {
      border-radius: 0 4px 4px 0;
    }

    &>.active {
      background-color: var(--v-c-primary);
    }
  }

  .week-action,
  .month-action {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
  }
}
</style>
