<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function jumpToToolList(): void {
  router.back()
}
</script>

<template>
  <div class="header-bar">
    <button @click="jumpToToolList">
      首页
    </button>
  </div>
</template>

<style lang="less" scoped>
.header-bar {
  display: flex;
  background-color: #f0f0f0;
  justify-content: space-between;
  padding: 10px;
}
</style>
