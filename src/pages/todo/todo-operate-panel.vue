<script setup lang="ts">
import { Flag } from '@element-plus/icons-vue'
import { VIcon } from "../../components";
import { type Priority } from './type';
import { PRIORITY_P1, PRIORITY_P2, PRIORITY_P3, PRIORITY_P4 } from './type';

const emit = defineEmits<{
  setPriority: [value: Priority]
}>()

function handleSetPriority(priority: Priority): void {
  emit('setPriority', priority)
}
</script>

<template>
  <div class="todo-operate-panel">
    <div class="title">优先级</div>
    <div class="priority-list">
      <VIcon class="priority priority--p1" @click="handleSetPriority(PRIORITY_P1)">
        <Flag />
      </VIcon>
      <VIcon class="priority priority--p2" @click="handleSetPriority(PRIORITY_P2)">
        <Flag />
      </VIcon>
      <VIcon class="priority priority--p3" @click="handleSetPriority(PRIORITY_P3)">
        <Flag />
      </VIcon>
      <VIcon class="priority priority--p4" @click="handleSetPriority(PRIORITY_P4)">
        <Flag />
      </VIcon>
    </div>
  </div>
</template>

<style lang="less" scoped>
.todo-operate-panel {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: absolute;
  z-index: 1000;
  width: 100px;

  .title {
    color: #5f5f5f;
    font-size: 14px;
    margin-bottom: 4px;
  }

  .priority-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .priority {
    font-size: 18px;
    cursor: pointer;
  }

  .priority--p1 {
    color: var(--priority-p1);
  }

  .priority--p2 {
    color: var(--priority-p2);
  }

  .priority--p3 {
    color: var(--priority-p3);
  }

  .priority--p4 {
    color: var(--priority-p4);
  }
}
</style>