<script setup lang="ts">
import { getCurrentWindow } from '@tauri-apps/api/window'
import { useRouter } from 'vue-router'
import { VDropdown } from '../../components'
import { TOOL_RECORD } from '../../router'

const router = useRouter()

function jumpTool(item: { value: string, label: string }): void {
  router.push(`/tool/${item.value}`)
  getCurrentWindow().setTitle(item.label)
}

const list = Object.values(TOOL_RECORD).map((x) => {
  return { label: x.title, value: x.name }
})
</script>

<template>
  <div class="header-bar" data-tauri-drag-region>
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
  background-color: #f2f5fe;
  justify-content: flex-end;
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
