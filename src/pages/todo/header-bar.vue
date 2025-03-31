<script setup lang="ts">
import { useRouter } from 'vue-router';
import { TOOL_RECORD } from '../../router';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { VDropdown } from "../../components";

const router = useRouter();

function jumpToToolList(): void {
  router.back();
}

function jumpTool(item: { value: string, label: string }): void {
  router.push(`/tool/${item.value}`);
  getCurrentWindow().setTitle(item.label);
}

const list = Object.values(TOOL_RECORD).map(x => {
  return { label: x.title, value: x.name }
})
</script>

<template>
  <div class="header-bar">
    <button @click="jumpToToolList">首页</button>
    <div class="tool-list">
      <VDropdown :list="list" @select="jumpTool">
        <span>小工具</span>
      </VDropdown>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header-bar {
  display: flex;
  background-color: #f0f0f0;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.tool-list {
  display: flex;
  gap: 10px;

  span {
    cursor: pointer;
  }
}
</style>
