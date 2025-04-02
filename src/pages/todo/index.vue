<script setup lang="ts">
import type { Group, Priority, TodoItem } from './type'
import { computed, ref, useTemplateRef } from 'vue'
import { useClickAway } from '../../hook/popover'
import { GroupAdd, GroupHeader, GroupSubHeader, HeaderBar, TodoCard, TodoDetail, TodoInput, TodoOperatePanel } from './component'
import { useContextmenu, useDetail, useGroup, useTodo } from './hook'

const { list: groupList, add: addGroup, load: loadGroupList, rename: renameGroup } = useGroup()
const { list: todoList, doneList, add, load, removeItem, setDone, setUnDone, setPriority, setExpiration, trans } = useTodo()

init()

const todos = computed<(Group & { todoSize: number, todoList: TodoItem[], doneSize: number, doneList: TodoItem[] })[]>(() => {
  return groupList.value.map((group) => {
    const todo = todoList.value.filter(item => item.group === group.uuid)
    const done = doneList.value.filter(item => item.group === group.uuid)
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

const { visible: detailVisible, item: detailItem, styles: detailStyles, show: detailShow, hide: detailHide } = useDetail()
function handleDetailUpdate(item: TodoItem): void {
  console.warn(item)
}

const { visible, styles, item, handleContextMenu, hide } = useContextmenu()
async function handleSetPriority(p: Priority): Promise<void> {
  if (item.value === null) {
    return
  }
  await setPriority(item.value.uuid, p)
  hide()
  await load()
}

async function handleSetExpiration(expiration: number): Promise<void> {
  if (item.value === null) {
    return
  }
  await setExpiration(item.value.uuid, expiration)
  hide()
  await load()
}
async function handleRemoveByContextmenu(): Promise<void> {
  if (item.value === null) {
    return
  }
  await removeItem(item.value.uuid)
  hide()
  await load()
}

const showTrans = ref<boolean>(import.meta.env.DEV)

const operatePanelRef = useTemplateRef('operate-panel-ref')
const operatePanelEl = computed<HTMLElement>(() => operatePanelRef.value?.$el)
useClickAway(operatePanelEl, hide)

const todoDetailRef = useTemplateRef('todo-detail-ref')
const todoDetailEl = computed<HTMLElement>(() => todoDetailRef.value?.$el)
useClickAway(todoDetailEl, detailHide)

const todoInputRef = useTemplateRef('todo-input-ref')
const todoInputEl = computed<HTMLElement>(() => todoInputRef.value?.$el)
useClickAway(todoInputEl, () => {
  console.warn('hide input')
  handleBlur()
})
</script>

<template>
  <div class="todo-layout">
    <HeaderBar />
    <div v-if="showTrans">
      <button @click="trans">
        转换
      </button>
    </div>

    <section class="main-area">
      <div v-for="group in todos" :key="group.uuid" class="group">
        <GroupHeader :name="group.name" :count="group.todoSize" @add="showAddInput(group.uuid)" @update="(text: string) => handleGroupUpdate(group.uuid, text)" />
        <TodoInput v-show="group.uuid === activeAddInput" ref="todo-input-ref" :group="activeAddInput" @submit="handleAddTodo" @blur="handleBlur" />
        <div class="todo-list">
          <TodoCard v-for="n in group.todoList" :key="n.uuid" :item="n" @set-done="handleSetDone" @set-un-done="handleSetUnDone" @contextmenu="handleContextMenu" @select="detailShow" />
        </div>
        <GroupSubHeader :count="group.doneSize" />
        <div class="todo-list">
          <TodoCard v-for="n in group.doneList" :key="n.uuid" :item="n" @set-done="handleSetDone" @set-un-done="handleSetUnDone" @contextmenu="handleContextMenu" @select="detailShow" />
        </div>
      </div>
      <GroupAdd @submit="handleAddGroup" />
    </section>

    <TodoOperatePanel v-show="visible" ref="operate-panel-ref" :style="styles" @set-priority="handleSetPriority" @set-expiration="handleSetExpiration" @remove="handleRemoveByContextmenu" />
    <TodoDetail v-show="detailVisible" ref="todo-detail-ref" :item="detailItem" :style="detailStyles" @update="handleDetailUpdate" />
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
  overflow-x: auto;
  display: flex;
  flex-direction: row;
  gap: 15px;
  padding: 10px;
  background-color: #f2f5fe;

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
