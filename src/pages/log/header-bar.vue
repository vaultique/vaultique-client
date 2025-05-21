<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function jumpToToolList(): void {
  router.back()
}
</script>

<template>
  <div class="header-bar" data-tauri-drag-region>
    <button @click="jumpToToolList">
      首页
    </button>
  </div>
</template>

<style lang="less" scoped>
.header-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #f0f0f0;
  gap: 12px;
  padding: 10px;
}
</style>
