<script setup lang="ts">
import type { Priority, TodoItem } from '../todo/type'
import type { CalendarMode, Cell } from './use-calendar'
import { computed, ref } from 'vue'
import { VPopover } from '../../components'
import { PRIORITY_P1, PRIORITY_P2, PRIORITY_P3, PRIORITY_P4 } from '../todo/type'
import HeaderBar from './header-bar.vue'
import useCalendar, { CALENDAR_MODE_MONTH } from './use-calendar'
import useTodo from './use-todo'

const WEEK_HEAD: string[] = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const mode = ref<CalendarMode>(CALENDAR_MODE_MONTH)
const { list: cellList, monthText, weekText, nextMonth, previewMonth, nextWeek, previewWeek } = useCalendar(mode)
const { todoList, doneList, load, setDone } = useTodo()

const list = computed<(Cell & { todo: TodoItem[], done: TodoItem[] })[]>(() => {
  return cellList.value.map((x) => {
    return {
      ...x,
      todo: todoList.value.filter(m => m.expiration !== undefined && m.expiration >= x.start && m.expiration <= x.end),
      done: doneList.value.filter(m => m.expiration !== undefined && m.expiration >= x.start && m.expiration <= x.end),
    }
  })
})

// TODO 代码复用
const CLASS_MAPPING: Record<Priority, string> = {
  [PRIORITY_P1]: 'todo-item--p1',
  [PRIORITY_P2]: 'todo-item--p2',
  [PRIORITY_P3]: 'todo-item--p3',
  [PRIORITY_P4]: 'todo-item--p4',
}

function handleContext(e: Event): void {
  e.preventDefault()
}

async function handleSetDone(uuid: string): Promise<void> {
  await setDone(uuid)
  await load()
}

function handleSwitch(m: CalendarMode): void {
  mode.value = m
}
</script>

<template>
  <div class="calendar-layout">
    <HeaderBar :month="monthText" :week="weekText" :mode="mode" @preview-month="previewMonth" @preview-week="previewWeek" @next-week="nextWeek" @next-month="nextMonth" @switch="handleSwitch" />
    <div class="calendar-head">
      <div v-for="n in WEEK_HEAD" :key="n" class="head-cell">
        {{ n }}
      </div>
    </div>
    <div class="calendar-list">
      <div v-for="item in list" :key="`${item.date}--${item.day}`" class="body-cell" :class="{ 'current-month': item.inMonth, 'current-day': item.today }">
        <div>{{ item.date }}</div>
        <template v-for="todo in item.todo" :key="todo.uuid">
          <VPopover arrow>
            <div class="todo-item" :class="CLASS_MAPPING[todo.priority]" @contextmenu="handleContext">
              {{ todo.title }}
            </div>
            <template #content>
              <div>
                <button @click="handleSetDone(todo.uuid)">
                  完成
                </button>
              </div>
            </template>
          </VPopover>
        </template>
        <div v-for="todo in item.done" :key="todo.uuid" class="todo-item todo-item--done">
          {{ todo.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.calendar-layout {
  --border: 1px solid #d8d8d8;
  --priority-p1: var(--v-c-error);
  --priority-p2: var(--v-c-warning);
  --priority-p3: var(--v-c-success);
  --priority-p4: var(--v-c-primary);
}

.calendar-layout {
  display: flex;
  flex-direction: column;
  background-color: #f2f5fe;
  height: 100%;
}

.calendar-head,
.calendar-list {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin: 0 8px;
}

.calendar-head {
  border-left: var(--border);
  border-top: var(--border);
  margin-top: 8px;
}

.calendar-list {
  border-left: var(--border);
  border-top: var(--border);
  flex: 1;
  margin-bottom: 8px;
}

.head-cell {
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: var(--border);
}

.body-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: var(--border);
  border-bottom: var(--border);
  color: #afafaf;
  padding: 6px 4px;

  .todo-item {
    align-self: stretch;
    border-radius: 2px;
    padding: 4px 8px;
    cursor: pointer;
  }

  .todo-item+.todo-item {
    margin-top: 4px;
  }

  .todo-item--done {
    background-color: #d3d3d3;
    color: #616161;
    cursor: auto;
  }

  .todo-item--p1 {
    background-color: var(--priority-p1);
  }

  .todo-item--p2 {
    background-color: var(--priority-p2);
  }

  .todo-item--p3 {
    background-color: var(--priority-p3);
  }

  .todo-item--p4 {
    background-color: var(--priority-p4);
  }
}

.current-month {
  color: #000000;
}

.current-day {
  background-color: #2080f050;
}
</style>
