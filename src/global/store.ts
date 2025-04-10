import type { Store } from '@tauri-apps/plugin-store'
import { load } from '@tauri-apps/plugin-store'
import { throttle } from 'lodash'
import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export const CALENDAR_MODE_WEEK = 0 as const
export const CALENDAR_MODE_MONTH = 1 as const

export type CalendarMode = typeof CALENDAR_MODE_WEEK | typeof CALENDAR_MODE_MONTH

const STORE_KEY_CALENDAR_MODE = 'calendar-mode'

export const useStore = defineStore('store', () => {
  let store: Store | undefined

  const calendarMode = ref<CalendarMode>(CALENDAR_MODE_MONTH)
  const debounceSaveCalendarMode = throttle(saveCalendarMode, 500)

  async function init(): Promise<void> {
    store = await load('store.json', { autoSave: false })
    loadCalendarMode()
  }

  async function loadCalendarMode(): Promise<void> {
    if (store === undefined) {
      return
    }
    const mode = await store.get<{ mode: CalendarMode }>(STORE_KEY_CALENDAR_MODE)
    calendarMode.value = mode?.mode ?? CALENDAR_MODE_MONTH
  }

  function setCalendarMode(mode: CalendarMode): void {
    calendarMode.value = mode
    debounceSaveCalendarMode(mode)
  }

  async function saveCalendarMode(mode: CalendarMode): Promise<void> {
    if (store === undefined) {
      return
    }
    await store.set(STORE_KEY_CALENDAR_MODE, { mode })
  }

  return { calendarMode: readonly(calendarMode), init, setCalendarMode }
})
