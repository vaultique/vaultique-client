<script setup lang="ts">
import type { Group, Priority, TodoItem } from './type'
import { Plus } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import { VIcon } from '../../components'
import { HeaderBar, TodoCard, TodoDetail, TodoInput, TodoOperatePanel } from './component'
import { useContextmenu, useDetail, useGroup, useTodo } from './hook'

const { name: groupName, list: groupList, add: addGroup, load: loadGroupList } = useGroup()
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

async function handleAddGroup(): Promise<void> {
  await addGroup()
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

const { visible: detailVisible, item: detailItem, styles: detailStyles, show: detailShow } = useDetail()
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
</script>

<template>
  <div class="todo-layout">
    <HeaderBar />
    <div>
      <button @click="handleAddGroup">
        添加分组
      </button>
      <input v-model="groupName" type="text">
      <button v-if="showTrans" @click="trans">
        转换
      </button>
    </div>

    <section class="main-area">
      <div v-for="group in todos" :key="group.uuid" class="group">
        <div class="group-title">
          <div class="name">
            {{ group.name }}
          </div>
          <div class="count">
            {{ group.todoSize }}
          </div>
          <div class="separate" />
          <VIcon class="add" @click="showAddInput(group.uuid)">
            <Plus />
          </VIcon>
        </div>
        <TodoInput v-show="group.uuid === activeAddInput" :group="activeAddInput" @submit="handleAddTodo"
          @blur="handleBlur" />
        <div class="todo-list">
          <TodoCard v-for="n in group.todoList" :key="n.uuid" :item="n" @set-done="handleSetDone"
            @set-un-done="handleSetUnDone" @contextmenu="handleContextMenu" @select="detailShow" />
        </div>
        <div class="group-sub-title">
          <div class="name">
            已完成
          </div>
          <div class="count">
            {{ group.doneSize }}
          </div>
        </div>
        <div class="todo-list">
          <TodoCard v-for="n in group.doneList" :key="n.uuid" :item="n" @set-done="handleSetDone"
            @set-un-done="handleSetUnDone" @contextmenu="handleContextMenu" @select="detailShow" />
        </div>
      </div>
    </section>

    <TodoOperatePanel v-show="visible" :style="styles" @set-priority="handleSetPriority"
      @set-expiration="handleSetExpiration" @remove="handleRemoveByContextmenu" />

    <TodoDetail v-show="detailVisible" :item="detailItem" :style="detailStyles" @update="handleDetailUpdate" />
  </div>
</template>

<style lang="less" scoped>
.todo-layout {
  --priority-p1: #ff4d4f;
  --priority-p2: #faad14;
  --priority-p3: #1890ff;
  --priority-p4: #696969;
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

    .group-title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      display: flex;
      font-size: 18px;
      margin-bottom: 12px;

      .name {
        font-weight: bolder;
      }

      .count {
        margin-left: 8px;
        color: #949494;
      }

      .separate {
        flex: 1;
      }

      .add {
        cursor: pointer;
      }
    }

    .group-sub-title {
      font-weight: bold;
      font-size: 14px;
      margin: 6px 0;
      display: flex;
      flex-direction: row;

      .count {
        margin-left: 8px;
        color: #949494;
      }
    }
  }

  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
