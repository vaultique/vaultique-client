<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import { computed, CSSProperties, ref } from 'vue';
import { VIcon } from "../../components";
import { HeaderBar, TodoCard, TodoInput, TodoOperatePanel } from "./component";
import { Group, Priority, TodoItem } from './type';
import useGroup from './use-group';
import useTodo from './use-todo';

const { name: groupName, list: groupList, add: addGroup, load: loadGroupList } = useGroup()
const { text, list: todoList, doneList, add, load, removeItem, setDone, setUnDone, setPriority, trans } = useTodo()

init()

const todos = computed<(Group & { size: number, todoList: TodoItem[] })[]>(() => {
  return groupList.value.map((group) => {
    return {
      ...group,
      size: todoList.value.filter((item) => item.group === group.uuid).length,
      todoList: [...todoList.value, ...doneList.value].filter((item) => item.group === group.uuid)
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

async function handleAddTodo(group: string): Promise<void> {
  await add(group)
  await load()
}

async function handleRemove(uuid: string): Promise<void> {
  await removeItem(uuid)
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
  text.value = ''
}

// TODO click away to hide
const CONTEXTMENU_DEFAULT_Z_INDEX = 1000
const visible = ref<boolean>(false)
const position = ref<[number, number]>([0, 0])
const priorityUuid = ref<string>('')
const styles = computed<CSSProperties>(() => {
  return {
    position: "fixed",
    zIndex: CONTEXTMENU_DEFAULT_Z_INDEX,
    left: `${position.value[0]}px`,
    top: `${position.value[1]}px`,
    display: visible.value ? "block" : "none",
  }
})
function handleContextMenu(uuid: string, po: [number, number]): void {
  visible.value = true
  position.value = po
  priorityUuid.value = uuid
}
async function handleSetPriority(p: Priority): Promise<void> {
  console.warn('set priority', p, priorityUuid.value)
  await setPriority(priorityUuid.value, p)
  await load()
  visible.value = false
}
</script>

<template>
  <div class="todo-layout">
    <HeaderBar />
    <div>
      <button @click="handleAddGroup">添加分组</button>
      <input type="text" v-model="groupName">
      <button @click="trans">转换</button>
    </div>

    <section class="main-area">
      <div class="group" v-for="group in todos" :key="group.uuid">
        <div class="group-title">
          <div class="name">{{ group.name }}</div>
          <div class="count">{{ group.size }}</div>
          <div class="separate"></div>
          <v-icon class="add" @click="showAddInput(group.uuid)">
            <Plus />
          </v-icon>
        </div>
        <TodoInput v-show="group.uuid === activeAddInput" v-model="text" @submit="handleAddTodo(group.uuid)"
          @blur="handleBlur"></TodoInput>
        <div class="todo-list">
          <TodoCard v-for="n in group.todoList" :item="n" @set-done="handleSetDone" @set-un-done="handleSetUnDone"
            @remove="handleRemove" @contextmenu="handleContextMenu"></TodoCard>
        </div>
      </div>
    </section>

    <TodoOperatePanel ref="todo-operate-panel" v-show="visible" :style="styles" @set-priority="handleSetPriority"></TodoOperatePanel>
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

  .group {
    flex: 0 0 300px;

    .group-title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      display: flex;

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
  }

  .todo-list {
    display: flex;
    flex-direction: column;
    margin-top: 15px;
    gap: 4px;
  }
}
</style>