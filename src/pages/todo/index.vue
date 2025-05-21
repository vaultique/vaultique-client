<script setup lang="ts">
import type { Group, TodoFilter, TodoItem } from './type'
import { NScrollbar } from 'naive-ui'
import hash from 'object-hash'
import { computed, ref, useTemplateRef } from 'vue'
import { VPopover } from '../../components'
import { useClickAway } from '../../hook/popover'
import { GroupAdd, GroupHeader, GroupSubHeader, HeaderBar, TodoCard, TodoDetail, TodoInput } from './component'
import { isExpirationExpired, isExpirationToday, isExpirationWeek } from './expiration'
import { useGroup, useTodo } from './hook'
import { TODO_FILTER_EXPIRED, TODO_FILTER_NONE, TODO_FILTER_TODAY, TODO_FILTER_WEEK } from './type'

const { list: groupList, add: addGroup, load: loadGroupList, rename: renameGroup } = useGroup()
const { list: todoList, doneList, add, load, removeItem, setDone, setUnDone, save } = useTodo()

init()

const filter = ref<TodoFilter>(TODO_FILTER_NONE)

const todos = computed<(Group & { todoSize: number, todoList: (TodoItem & { hash: string })[], doneSize: number, doneList: (TodoItem & { hash: string })[] })[]>(() => {
  return groupList.value.map((group) => {
    const todo = todoList
      .value
      .filter((item) => {
        if (filter.value === TODO_FILTER_TODAY) {
          return item.group === group.uuid && isExpirationToday(item.expiration)
        }
        if (filter.value === TODO_FILTER_WEEK) {
          return item.group === group.uuid && isExpirationWeek(item.expiration)
        }
        if (filter.value === TODO_FILTER_EXPIRED) {
          return item.group === group.uuid && isExpirationExpired(item.expiration)
        }
        return item.group === group.uuid
      })
      .map(x => ({ ...x, hash: hash(x) }))
    const done = doneList
      .value
      .filter((item) => {
        if (filter.value === TODO_FILTER_TODAY) {
          return item.group === group.uuid && isExpirationToday(item.expiration)
        }
        if (filter.value === TODO_FILTER_WEEK) {
          return item.group === group.uuid && isExpirationWeek(item.expiration)
        }
        if (filter.value === TODO_FILTER_EXPIRED) {
          return item.group === group.uuid && isExpirationExpired(item.expiration)
        }
        return item.group === group.uuid
      })
      .map(x => ({ ...x, hash: hash(x) }))
      .sort((a, b) => (b.doneTime ?? 0) - (a.doneTime ?? 0))
    return {
      ...group,
      todoSize: todo.length,
      todoList: todo,
      doneSize: done.length,
      doneList: done,
    }
  })
})

async function handleAddGroup(text: string): Promise<void> {
  await addGroup(text)
  await loadGroupList()
}

async function handleGroupUpdate(uuid: string, text: string): Promise<void> {
  await renameGroup(uuid, text)
  await loadGroupList()
}

async function init(): Promise<void> {
  await loadGroupList()
  await load()
}

async function handleAddTodo(item: TodoItem): Promise<void> {
  await add(item)
  await load()
}

async function handleSetDone(uuid: string): Promise<void> {
  await setDone(uuid)
  await load()
}

async function handleSetUnDone(uuid: string): Promise<void> {
  await setUnDone(uuid)
  await load()
}

const activeAddInput = ref<string>('')
function showAddInput(uuid: string): void {
  activeAddInput.value = uuid
}
function handleBlur(): void {
  activeAddInput.value = ''
}

async function handleDetailUpdate(item: TodoItem): Promise<void> {
  await save(item)
  await load()
}

async function handleRemove(uuid: string): Promise<void> {
  await removeItem(uuid)
  await load()
}

const todoInputRef = useTemplateRef('todo-input-ref')
const todoInputEl = computed<HTMLElement>(() => todoInputRef.value?.$el)
useClickAway(todoInputEl, () => {
  handleBlur()
})
</script>

<template>
  <div class="todo-layout">
    <HeaderBar v-model="filter" />
    <section class="main-area">
      <div v-for="group in todos" :key="group.uuid" class="group">
        <NScrollbar>
          <GroupHeader :name="group.name" :count="group.todoSize" @add="showAddInput(group.uuid)" @update="(text: string) => handleGroupUpdate(group.uuid, text)" />
          <TodoInput v-show="group.uuid === activeAddInput" ref="todo-input-ref" :group="activeAddInput" @submit="handleAddTodo" @blur="handleBlur" />
          <div class="todo-list">
            <template v-for="n in group.todoList" :key="n.hash">
              <VPopover arrow placement="right-start">
                <TodoCard :item="n" @set-done="handleSetDone" @set-un-done="handleSetUnDone" />
                <template #content="{ visible }">
                  <TodoDetail :visible="visible" :item="n" @update="handleDetailUpdate" @remove="handleRemove" />
                </template>
              </VPopover>
            </template>
          </div>
          <GroupSubHeader :count="group.doneSize" />
          <div class="todo-list">
            <TodoCard v-for="n in group.doneList" :key="n.uuid" :item="n" @set-done="handleSetDone" @set-un-done="handleSetUnDone" />
          </div>
        </NScrollbar>
      </div>
      <GroupAdd @submit="handleAddGroup" />
    </section>
  </div>
</template>

<style lang="less" scoped>
.todo-layout {
  --priority-p1: var(--v-c-error);
  --priority-p2: var(--v-c-warning);
  --priority-p3: var(--v-c-success);
  --priority-p4: var(--v-c-primary);
}

.todo-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header-bar {
  flex: 0 0 24px;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 15px;
  padding: 10px;
  background-color: #f2f5fe;
  overflow-y: hidden;

  .group {
    flex: 0 0 300px;

    .todo-input {
      margin-bottom: 12px;
    }
  }

  .group-add {
    flex: 0 0 300px;
    height: 24px;
  }

  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
