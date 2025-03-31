<script setup lang="ts">
import type { Priority } from './type'
import { Delete, Flag, Sunny, Sunrise, Timer } from '@element-plus/icons-vue'
import { VIcon } from '../../components'
import { convertexpirationText2Timestamp } from './expiration'
import { PRIORITY_P1, PRIORITY_P2, PRIORITY_P3, PRIORITY_P4 } from './type'

const emit = defineEmits<{
  setPriority: [value: Priority]
  setExpiration: [value: number]
  remove: []
}>()

function handleSetPriority(priority: Priority): void {
  emit('setPriority', priority)
}

function handleSetExpiration(e: 'today' | 'tomorror' | 'week-end'): void {
  emit('setExpiration', convertexpirationText2Timestamp(e))
}

function handleRemove(): void {
  emit('remove')
}
</script>

<template>
  <div class="todo-operate-panel">
    <div class="title">
      日期
    </div>
    <div class="expiration-list">
      <VIcon class="expiration" @click="handleSetExpiration('today')">
        <Sunny />
      </VIcon>
      <VIcon class="expiration" @click="handleSetExpiration('tomorror')">
        <Sunrise />
      </VIcon>
      <VIcon class="expiration" @click="handleSetExpiration('week-end')">
        <Timer />
      </VIcon>
    </div>
    <div class="title">
      优先级
    </div>
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
    <div class="operate-line" @click="handleRemove">
      <VIcon>
        <Delete />
      </VIcon>
      <div>删除</div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.todo-operate-panel {
  background-color: #ffffff;
  border-radius: 4px;
  padding: 8px 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: absolute;
  z-index: 1000;
  width: 100px;

  .operate-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 24px;
    border-radius: 4px;
    padding: 2px 4px;
    cursor: pointer;
    margin-top: 8px;

    &:hover {
      background-color: #e9e9e9;
    }

    .v-icon {
      margin-right: 4px;
    }
  }

  .title {
    color: #5f5f5f;
    font-size: 14px;
    margin-bottom: 4px;
    padding: 0 4px;
  }

  .priority-list,
  .expiration-list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 4px;
  }

  .priority,
  .expiration {
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
