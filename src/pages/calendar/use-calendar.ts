import type { Dayjs } from 'dayjs'
import type { ComputedRef, Ref } from 'vue'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { computed, onUnmounted, ref, watch } from 'vue'

dayjs.extend(weekOfYear)

export type Cell = {
  date: number
  day: number
  inMonth: boolean
  today: boolean
  start: number
  end: number
}

export const CALENDAR_MODE_WEEK = 0 as const
export const CALENDAR_MODE_MONTH = 1 as const

export type CalendarMode = typeof CALENDAR_MODE_WEEK | typeof CALENDAR_MODE_MONTH

type Fn = () => void

export default function useCalendar(mode: Ref<CalendarMode>): {
  list: Ref<Cell[]>
  monthText: ComputedRef<string>
  weekText: ComputedRef<string>
  nextMonth: Fn
  previewMonth: Fn
  nextWeek: Fn
  previewWeek: Fn
} {
  const date = ref<Dayjs>(dayjs())
  const monthText = computed<string>(() => date.value.format('YYYY-MM'))
  const weekText = computed<string>(() => `${date.value.year()} 第${date.value.week()}周`)
  const list = ref<Cell[]>(generate())

  const handler = watch(mode, () => {
    list.value = generate()
  })

  onUnmounted(() => {
    handler()
  })

  function generate(): Cell[] {
    if (mode.value === CALENDAR_MODE_WEEK) {
      return generateWeekList(date.value)
    }
    if (mode.value === CALENDAR_MODE_MONTH)
      return generateMonthList(date.value)
    return []
  }

  function nextMonth(): void {
    date.value = date.value.add(1, 'month')
    list.value = generate()
  }

  function previewMonth(): void {
    date.value = date.value.subtract(1, 'month')
    list.value = generate()
  }

  function nextWeek(): void {
    date.value = date.value.add(1, 'week')
    list.value = generate()
  }

  function previewWeek(): void {
    date.value = date.value.subtract(1, 'week')
    list.value = generate()
  }

  return { list, monthText, weekText, nextMonth, previewMonth, nextWeek, previewWeek }
}

function generateWeekList(date: Dayjs): Cell[] {
  const list: Cell[] = []
  for (let i = 1; i <= 7; i++) {
    date = date.day(i)
    const cell: Cell = generateCell(date, true)
    list.push(cell)
  }
  return list
}

function generateMonthList(date: Dayjs): Cell[] {
  const list: Cell[] = []
  const month = date.month()
  date = date.startOf('month')
  const m = date.month()
  while (date.month() === m) {
    const cell: Cell = generateCell(date, true)
    list.push(cell)
    date = date.add(1, 'day')
  }
  while (list.at(-1)?.day !== 0) {
    const cell: Cell = generateCell(date, false)
    list.push(cell)
    date = date.add(1, 'day')
  }
  date = dayjs().month(month).startOf('month').subtract(1, 'day')
  while (list[0].day !== 1) {
    const cell: Cell = generateCell(date, false)
    list.unshift(cell)
    date = date.subtract(1, 'day')
  }
  return list
}

function generateCell(date: Dayjs, inMonth: boolean): Cell {
  return {
    date: date.date(),
    day: date.day(),
    start: date.startOf('day').valueOf(),
    end: date.endOf('day').valueOf(),
    inMonth,
    today: date.isSame(dayjs(), 'day'),
  }
}
