import type { Dayjs } from 'dayjs'
import type { ComputedRef, Ref } from 'vue'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'

export type Cell = {
  date: number
  day: number
  inMonth: boolean
  start: number
  end: number
}

type Fn = () => void

export default function useCalendar(): { list: Ref<Cell[]>, text: ComputedRef<string>, next: Fn, preview: Fn } {
  const date = ref<Dayjs>(dayjs())
  const text = computed<string>(() => date.value.format('YYYY-MM'))
  const list = ref<Cell[]>(generateList(date.value))

  function next(): void {
    date.value = date.value.add(1, 'month')
    list.value = generateList(date.value)
  }

  function preview(): void {
    date.value = date.value.subtract(1, 'month')
    list.value = generateList(date.value)
  }

  return { list, text, next, preview }
}

function generateList(date: Dayjs): Cell[] {
  const li: Cell[] = []
  const month = date.month()
  date = date.startOf('month')
  const m = date.month()
  while (date.month() === m) {
    const cell: Cell = {
      date: date.date(),
      day: date.day(),
      start: date.startOf('day').valueOf(),
      end: date.endOf('day').valueOf(),
      inMonth: true,
    }
    li.push(cell)
    date = date.add(1, 'day')
  }
  while (li.at(-1)?.day !== 0) {
    const cell: Cell = {
      date: date.date(),
      day: date.day(),
      start: date.startOf('day').valueOf(),
      end: date.endOf('day').valueOf(),
      inMonth: false,
    }
    li.push(cell)
    date = date.add(1, 'day')
  }
  date = dayjs().month(month).startOf('month').subtract(1, 'day')
  while (li[0].day !== 1) {
    const cell: Cell = {
      date: date.date(),
      day: date.day(),
      start: date.startOf('day').valueOf(),
      end: date.endOf('day').valueOf(),
      inMonth: false,
    }
    li.unshift(cell)
    date = date.subtract(1, 'day')
  }
  return li
}
