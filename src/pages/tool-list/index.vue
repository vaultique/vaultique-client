<script setup lang="ts">
import ToolCard from '@/components/tool-card/index.vue';
import { useRouter } from 'vue-router';
import { TOOL_RECORD } from '../../router';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { onMounted } from 'vue';

const router = useRouter();

function jumpTool(item: { name: string, title: string }): void {
  router.push(`/tool/${item.name}`);
  getCurrentWindow().setTitle(item.title);
}

onMounted(() => {
  getCurrentWindow().setTitle("工具列表");
})
</script>

<template>
  <div class="tool-list-page">
    <ToolCard v-for="tool in TOOL_RECORD" :key="tool.name" :title="tool.name" @click="jumpTool(tool)" />
  </div>
</template>

<style scoped lang="less">
.tool-list-page {
  padding: 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
}
</style>